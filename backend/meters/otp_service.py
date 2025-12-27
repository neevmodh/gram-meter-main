"""
OTP Service for Mobile-based Two-Factor Authentication
Handles OTP generation, storage, verification, and SMS delivery via Twilio
"""

import pyotp
import random
import string
from django.core.cache import cache
from django.conf import settings
from datetime import datetime, timedelta
from twilio.rest import Client
import logging

logger = logging.getLogger(__name__)


class OTPService:
    """Service for managing OTP-based 2FA authentication"""
    
    # OTP Configuration
    OTP_LENGTH = 6
    OTP_VALIDITY_MINUTES = 5
    MAX_OTP_ATTEMPTS = 3
    RESEND_COOLDOWN_SECONDS = 60
    
    def __init__(self):
        """Initialize Twilio client for SMS delivery"""
        self.twilio_client = None
        self.twilio_phone = None
        
        if all([
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN,
            settings.TWILIO_PHONE_NUMBER
        ]):
            self.twilio_client = Client(
                settings.TWILIO_ACCOUNT_SID,
                settings.TWILIO_AUTH_TOKEN
            )
            self.twilio_phone = settings.TWILIO_PHONE_NUMBER
            logger.info("Twilio OTP service initialized successfully")
        else:
            logger.warning("Twilio credentials not configured - OTP SMS will not work")
    
    def generate_otp(self):
        """Generate a random 6-digit OTP"""
        return ''.join(random.choices(string.digits, k=self.OTP_LENGTH))
    
    def get_cache_key(self, identifier, key_type='otp'):
        """Generate cache key for storing OTP data"""
        return f"otp_{key_type}_{identifier}"
    
    def send_otp(self, phone_number, user_id):
        """
        Generate and send OTP to user's phone number
        
        Args:
            phone_number: User's mobile number (E.164 format)
            user_id: User ID for tracking
            
        Returns:
            dict: {'success': bool, 'message': str, 'wait_time': int}
        """
        try:
            # Check resend cooldown
            cooldown_key = self.get_cache_key(user_id, 'cooldown')
            if cache.get(cooldown_key):
                wait_time = cache.ttl(cooldown_key)
                return {
                    'success': False,
                    'message': f'Please wait {wait_time} seconds before requesting another OTP',
                    'wait_time': wait_time
                }
            
            # Generate OTP
            otp = self.generate_otp()
            
            # Store OTP in cache with expiry
            otp_key = self.get_cache_key(user_id, 'otp')
            attempts_key = self.get_cache_key(user_id, 'attempts')
            
            cache.set(otp_key, otp, timeout=self.OTP_VALIDITY_MINUTES * 60)
            cache.set(attempts_key, 0, timeout=self.OTP_VALIDITY_MINUTES * 60)
            cache.set(cooldown_key, True, timeout=self.RESEND_COOLDOWN_SECONDS)
            
            # Send SMS via Twilio
            if self.twilio_client and self.twilio_phone:
                message = (
                    f"🔐 Your Gram Meter verification code is: {otp}\n\n"
                    f"Valid for {self.OTP_VALIDITY_MINUTES} minutes. "
                    f"Do not share this code with anyone."
                )
                
                try:
                    sms = self.twilio_client.messages.create(
                        body=message,
                        from_=self.twilio_phone,
                        to=phone_number
                    )
                    logger.info(f"OTP SMS sent successfully to {phone_number} - SID: {sms.sid}")
                    
                    return {
                        'success': True,
                        'message': f'OTP sent to {phone_number}',
                        'expires_in': self.OTP_VALIDITY_MINUTES * 60
                    }
                except Exception as e:
                    logger.error(f"Failed to send OTP SMS: {str(e)}")
                    # Store OTP for testing even if SMS fails
                    return {
                        'success': True,
                        'message': f'OTP generated (SMS failed): {otp}',  # Remove in production
                        'expires_in': self.OTP_VALIDITY_MINUTES * 60,
                        'otp': otp  # For development/testing only
                    }
            else:
                # Fallback for testing without Twilio
                logger.warning(f"Twilio not configured - OTP: {otp}")
                return {
                    'success': True,
                    'message': f'OTP generated (testing mode): {otp}',
                    'expires_in': self.OTP_VALIDITY_MINUTES * 60,
                    'otp': otp  # For development/testing only
                }
                
        except Exception as e:
            logger.error(f"Error generating/sending OTP: {str(e)}")
            return {
                'success': False,
                'message': 'Failed to send OTP. Please try again.'
            }
    
    def verify_otp(self, user_id, otp_code):
        """
        Verify OTP code for a user
        
        Args:
            user_id: User ID
            otp_code: OTP code to verify
            
        Returns:
            dict: {'valid': bool, 'message': str}
        """
        try:
            otp_key = self.get_cache_key(user_id, 'otp')
            attempts_key = self.get_cache_key(user_id, 'attempts')
            
            # Get stored OTP
            stored_otp = cache.get(otp_key)
            if not stored_otp:
                return {
                    'valid': False,
                    'message': 'OTP expired or not found. Please request a new one.'
                }
            
            # Check attempt count
            attempts = cache.get(attempts_key, 0)
            if attempts >= self.MAX_OTP_ATTEMPTS:
                cache.delete(otp_key)
                cache.delete(attempts_key)
                return {
                    'valid': False,
                    'message': 'Maximum verification attempts exceeded. Please request a new OTP.'
                }
            
            # Verify OTP
            if stored_otp == otp_code:
                # Clear OTP data on success
                cache.delete(otp_key)
                cache.delete(attempts_key)
                cache.delete(self.get_cache_key(user_id, 'cooldown'))
                
                logger.info(f"OTP verified successfully for user {user_id}")
                return {
                    'valid': True,
                    'message': 'OTP verified successfully'
                }
            else:
                # Increment attempt count
                cache.set(attempts_key, attempts + 1, timeout=self.OTP_VALIDITY_MINUTES * 60)
                remaining = self.MAX_OTP_ATTEMPTS - attempts - 1
                
                return {
                    'valid': False,
                    'message': f'Invalid OTP. {remaining} attempts remaining.'
                }
                
        except Exception as e:
            logger.error(f"Error verifying OTP: {str(e)}")
            return {
                'valid': False,
                'message': 'Error verifying OTP. Please try again.'
            }
    
    def clear_otp(self, user_id):
        """Clear all OTP data for a user"""
        cache.delete(self.get_cache_key(user_id, 'otp'))
        cache.delete(self.get_cache_key(user_id, 'attempts'))
        cache.delete(self.get_cache_key(user_id, 'cooldown'))


# Singleton instance
otp_service = OTPService()
