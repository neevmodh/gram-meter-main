# Core App - Shared Utilities & Base Classes

The `core` app provides **shared functionality** used across all Gram Meter apps. It contains reusable base classes, utilities, constants, and custom validators.

---

## 📁 Structure

```
core/
├── __init__.py
├── apps.py                 # App configuration
├── models.py              # Abstract base models
├── permissions.py         # Custom DRF permissions
├── utils.py               # Utility functions
├── exceptions.py          # Custom exceptions & handlers
├── mixins.py              # Reusable view mixins
├── constants.py           # Application-wide constants
└── validators.py          # Custom field validators
```

---

## 🧱 Base Models

### `TimeStampedModel`
Abstract model that adds `created_at` and `updated_at` fields to all models.

**Usage:**
```python
from core.models import TimeStampedModel

class MyModel(TimeStampedModel):
    name = models.CharField(max_length=100)
    # Automatically gets created_at and updated_at
```

### `SoftDeleteModel`
Abstract model for soft deletion (marks records as deleted instead of removing them).

**Usage:**
```python
from core.models import SoftDeleteModel

class MyModel(SoftDeleteModel):
    name = models.CharField(max_length=100)

# Soft delete
obj.soft_delete()

# Restore
obj.restore()
```

### `AuditModel`
Combines timestamps with audit fields (`created_by`, `updated_by`).

---

## 🔐 Custom Permissions

- `IsOwnerOrReadOnly` - Only owners can edit, everyone can read
- `IsFarmerOrAbove` - Farmer, Sarpanch, Utility, Government roles
- `IsSarpanchOrAbove` - Sarpanch and above
- `IsUtilityOrAbove` - Utility and Government only
- `IsGovernment` - Government role only
- `IsOwnerOrStaffReadOnly` - Owners edit, staff read-only

**Usage:**
```python
from core.permissions import IsSarpanchOrAbove

class MyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSarpanchOrAbove]
```

---

## 🛠️ Utility Functions

### Meter ID Generation
```python
from core.utils import generate_meter_id

meter_id = generate_meter_id("ANAND", "BORSAD")
# Output: "GJ-ANAND-12345"
```

### Power Calculations
```python
from core.utils import calculate_power_factor, calculate_energy

pf = calculate_power_factor(voltage=230, current=10, power=2300)
energy = calculate_energy(power_w=2300, duration_seconds=3600)
```

### Tariff Calculation
```python
from core.utils import get_tariff_cost

cost = get_tariff_cost(units=275)
# Returns Decimal cost based on Gujarat slab rates
```

### Efficiency Grading
```python
from core.utils import get_efficiency_grade

grade = get_efficiency_grade(score=87)
# Output: "A-"
```

### Message Translation
```python
from core.utils import translate_message

hindi_msg = translate_message("High voltage detected", "hi")
# Output: "उच्च वोल्टेज का पता चला"
```

### Indian Currency Formatting
```python
from core.utils import format_indian_currency

formatted = format_indian_currency(Decimal("123456.78"))
# Output: "₹1,23,456.78"
```

---

## 🎯 Constants

All application-wide constants are defined in `constants.py`:

```python
from core.constants import (
    USER_ROLES,
    ALERT_TYPES,
    METER_TYPES,
    GUJARAT_TARIFF,
    ELECTRICAL_STANDARDS
)

# Example usage
if user.role == USER_ROLES['FARMER']:
    # Do something

if voltage > ELECTRICAL_STANDARDS['NOMINAL_VOLTAGE']:
    # Alert
```

**Available Constants:**
- `USER_ROLES` - Farmer, Sarpanch, Utility, Government
- `LANGUAGES` - English, Hindi, Gujarati
- `METER_TYPES` - Residential, Commercial, Agricultural, Industrial
- `ALERT_TYPES` - 8 alert types
- `ALERT_SEVERITY` - Info, Warning, Critical, Emergency
- `NOTIFICATION_CHANNELS` - WhatsApp, SMS, Email, Push
- `BILL_STATUS` - Draft, Pending, Paid, Overdue, Cancelled
- `GUJARAT_TARIFF` - Slab rates and charges
- `ELECTRICAL_STANDARDS` - Voltage, frequency standards
- `CACHE_TIMEOUTS` - Redis cache durations
- `RATE_LIMITS` - API rate limiting

---

## ✅ Validators

Custom validators for common fields:

```python
from core.validators import (
    validate_phone_number,
    validate_meter_id,
    validate_voltage,
    validate_gps_coordinates
)

# In models.py
class Meter(models.Model):
    meter_id = models.CharField(
        max_length=20,
        validators=[validate_meter_id]
    )
    voltage = models.FloatField(
        validators=[validate_voltage]
    )
```

**Available Validators:**
- `validate_phone_number` - Indian mobile numbers (+91 format)
- `validate_meter_id` - GJ-DISTRICT-XXXXX format
- `validate_voltage` - 0-500V range
- `validate_current` - 0-200A range
- `validate_power_factor` - 0-1 range
- `validate_gps_coordinates` - Gujarat region bounds
- `indian_pincode_validator` - 6-digit PIN codes
- `meter_serial_validator` - 8-16 alphanumeric
- `ifsc_code_validator` - Bank IFSC codes

---

## 🚨 Custom Exceptions

```python
from core.exceptions import (
    MeterNotFoundException,
    InvalidReadingException,
    InsufficientDataException,
    MLModelException
)

# Usage
if not meter:
    raise MeterNotFoundException("Meter GJ-ANAND-00123 not found")
```

**Exception Handler:**
The `custom_exception_handler` in `exceptions.py` provides consistent error responses:

```json
{
  "success": false,
  "error": {
    "message": "Meter not found",
    "type": "MeterNotFoundException",
    "status_code": 404
  }
}
```

To enable, add to `settings.py`:
```python
REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'core.exceptions.custom_exception_handler'
}
```

---

## 🔄 View Mixins

Reusable mixins for DRF views:

### SuccessResponseMixin
```python
from core.mixins import SuccessResponseMixin

class MyViewSet(SuccessResponseMixin, viewsets.ModelViewSet):
    def my_action(self, request):
        return self.success_response(
            data={'result': 'success'},
            message="Operation completed"
        )
```

### UserFilterMixin
```python
from core.mixins import UserFilterMixin

class MyViewSet(UserFilterMixin, viewsets.ModelViewSet):
    # Automatically filters queryset by request.user
    pass
```

### TimestampFilterMixin
```python
from core.mixins import TimestampFilterMixin

class MyViewSet(TimestampFilterMixin, viewsets.ModelViewSet):
    def list(self, request):
        queryset = self.get_queryset()
        queryset = self.filter_by_date_range(
            queryset,
            start_date=request.query_params.get('start'),
            end_date=request.query_params.get('end')
        )
        # ...
```

---

## 📊 Usage Examples

### Example 1: Custom Model with Base Classes
```python
from django.db import models
from core.models import TimeStampedModel, SoftDeleteModel

class Bill(TimeStampedModel, SoftDeleteModel):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20)
    
    # Automatically has: created_at, updated_at, is_deleted, deleted_at
```

### Example 2: Role-Based Permissions
```python
from rest_framework import viewsets
from core.permissions import IsSarpanchOrAbove

class VillageReportViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsSarpanchOrAbove]
    # Only Sarpanch, Utility, and Government can access
```

### Example 3: Using Utilities
```python
from core.utils import get_tariff_cost, format_indian_currency
from decimal import Decimal

units_consumed = 275
cost = get_tariff_cost(units_consumed)
formatted_cost = format_indian_currency(cost)

print(f"Bill: {formatted_cost}")  # Output: "Bill: ₹1,540.00"
```

### Example 4: Constants in Views
```python
from core.constants import ALERT_SEVERITY, ELECTRICAL_STANDARDS

def check_voltage(voltage):
    nominal = ELECTRICAL_STANDARDS['NOMINAL_VOLTAGE']
    tolerance = ELECTRICAL_STANDARDS['VOLTAGE_TOLERANCE']
    
    if voltage > nominal + tolerance:
        severity = ALERT_SEVERITY['CRITICAL']
        # Create alert...
```

---

## 🎯 Benefits

1. **DRY Principle** - Reusable code across all apps
2. **Consistency** - Standardized utilities and validators
3. **Maintainability** - Single source of truth for constants
4. **Type Safety** - Defined constants prevent typos
5. **Audit Trail** - Base models with timestamps
6. **Soft Delete** - Preserve data with soft deletion
7. **Localization** - Translation utilities for Hindi/Gujarati
8. **Indian Standards** - Validators and formatters for Indian context

---

## 🚀 Integration with Other Apps

The core app is imported and used by:

- **meters** - Uses validators, base models, permissions
- **analytics** - Uses utils for calculations, constants
- **billing** - Uses tariff calculations, Indian currency formatting
- **notifications** - Uses translation utilities
- **All apps** - Use constants, validators, base models

---

## ✅ Status

- [x] Base models created
- [x] Custom permissions defined
- [x] Utility functions implemented
- [x] Constants centralized
- [x] Validators created
- [x] Exception handling setup
- [x] View mixins added
- [x] Documentation complete

**The core app is now fully functional and provides 30+ reusable utilities!**
