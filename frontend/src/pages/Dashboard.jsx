// Rural Dashboard - Simple & Practical for Farmers
import React, { useState } from 'react';
import { 
  Zap, Droplets, Phone, Volume2, Sun, Cloud, Clock, 
  AlertTriangle, CheckCircle, IndianRupee, Calendar, 
  Power, PhoneCall, Wind
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useRealtimeData, useBillingData } from '../hooks/useRealtimeData';
import toast from 'react-hot-toast';

// Voice Alert Helper
const speakText = (text, lang = 'hi-IN') => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

// Large Status Card
const BigStatusCard = ({ icon: Icon, label, labelHi, value, unit, status, color, onSpeak }) => {
  const statusColors = { good: 'bg-green-500', warning: 'bg-yellow-500', danger: 'bg-red-500', off: 'bg-gray-400' };
  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 ${
      status === 'danger' ? 'border-red-500 animate-pulse' : 
      status === 'warning' ? 'border-yellow-500' : 'border-gray-200 dark:border-gray-700'
    } transition-all`}>
      <div className={`absolute top-3 right-3 w-4 h-4 rounded-full ${statusColors[status] || statusColors.good}`} />
      <div className={`w-16 h-16 rounded-xl ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
      <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">{labelHi}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">{value}</span>
        <span className="text-xl text-gray-500">{unit}</span>
      </div>
      {onSpeak && (
        <button onClick={(e) => { e.stopPropagation(); onSpeak(); }}
          className="absolute bottom-3 right-3 p-2 bg-blue-100 dark:bg-blue-900 rounded-full hover:bg-blue-200">
          <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </button>
      )}
    </div>
  );
};

// Pump Control Card
const PumpControlCard = ({ isOn, onToggle, runtime, onSpeak }) => (
  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-xl font-bold">Pump Control</h3>
        <p className="text-blue-100">पंप नियंत्रण</p>
      </div>
      <Droplets className="w-10 h-10 text-blue-200" />
    </div>
    <button onClick={onToggle}
      className={`w-full py-6 rounded-xl text-2xl font-bold transition-all ${
        isOn ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' 
             : 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30'
      }`}>
      <Power className="w-8 h-8 mx-auto mb-2" />
      {isOn ? 'बंद करें (OFF)' : 'चालू करें (ON)'}
    </button>
    <div className="mt-4 flex items-center justify-between text-blue-100">
      <span>आज का समय / Today</span>
      <span className="text-xl font-bold text-white">{runtime} hrs</span>
    </div>
    {onSpeak && (
      <button onClick={onSpeak} className="mt-3 w-full py-2 bg-white/20 rounded-lg flex items-center justify-center gap-2 hover:bg-white/30">
        <Volume2 className="w-5 h-5" /><span>सुनें / Listen</span>
      </button>
    )}
  </div>
);

// Weather Card
const WeatherCard = ({ temp, humidity, condition }) => (
  <div className="bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl p-5 text-white shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-orange-100 text-sm">Today's Weather / आज का मौसम</p>
        <p className="text-4xl font-bold mt-1">{temp}°C</p>
        <div className="flex items-center gap-4 mt-2 text-orange-100">
          <span className="flex items-center gap-1"><Droplets className="w-4 h-4" /> {humidity}%</span>
          <span className="flex items-center gap-1"><Wind className="w-4 h-4" /> 12 km/h</span>
        </div>
      </div>
      {condition === 'cloudy' ? <Cloud className="w-12 h-12 text-gray-200" /> : <Sun className="w-12 h-12 text-yellow-200" />}
    </div>
  </div>
);

// Electricity Schedule Card
const ElectricityScheduleCard = ({ schedule }) => {
  const currentHour = new Date().getHours();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-6 h-6 text-purple-500" />
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">Power Schedule</h3>
          <p className="text-sm text-gray-500">बिजली का समय</p>
        </div>
      </div>
      <div className="space-y-2">
        {schedule.map((slot, i) => (
          <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
            currentHour >= slot.start && currentHour < slot.end
              ? 'bg-green-100 dark:bg-green-900/30 border border-green-500'
              : 'bg-gray-50 dark:bg-gray-700'
          }`}>
            <span className="font-medium text-gray-700 dark:text-gray-300">{slot.start}:00 - {slot.end}:00</span>
            {currentHour >= slot.start && currentHour < slot.end ? (
              <span className="flex items-center gap-1 text-green-600 font-bold"><CheckCircle className="w-5 h-5" /> ON</span>
            ) : <span className="text-gray-400">Scheduled</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

// Emergency Contacts Card
const EmergencyContactsCard = ({ contacts }) => (
  <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-5 border border-red-200 dark:border-red-800">
    <div className="flex items-center gap-3 mb-4">
      <Phone className="w-6 h-6 text-red-500" />
      <div>
        <h3 className="font-bold text-red-700 dark:text-red-400">Emergency / आपातकाल</h3>
        <p className="text-sm text-red-500">Tap to call / कॉल करें</p>
      </div>
    </div>
    <div className="space-y-2">
      {contacts.map((c, i) => (
        <button key={i} onClick={() => window.location.href = `tel:${c.phone}`}
          className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30">
          <div className="text-left">
            <p className="font-medium text-gray-900 dark:text-white">{c.name}</p>
            <p className="text-sm text-gray-500">{c.nameHi}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">{c.phone}</span>
            <PhoneCall className="w-5 h-5 text-green-500" />
          </div>
        </button>
      ))}
    </div>
  </div>
);

// Current Bill Card
const CurrentBillCard = ({ amount, units, dueDate, onSpeak, onPay }) => (
  <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-medium text-emerald-100">This Month's Bill</h3>
        <p className="text-emerald-200">इस महीने का बिल</p>
      </div>
      <IndianRupee className="w-8 h-8 text-emerald-200" />
    </div>
    <div className="text-5xl font-bold mb-2">₹{amount}</div>
    <p className="text-emerald-100 mb-4">{units} Units / यूनिट</p>
    <div className="flex items-center gap-2 text-emerald-200 mb-4">
      <Calendar className="w-4 h-4" /><span>Due: {dueDate}</span>
    </div>
    <div className="flex gap-2">
      <button onClick={onSpeak} className="flex-1 py-3 bg-white/20 rounded-xl flex items-center justify-center gap-2 hover:bg-white/30">
        <Volume2 className="w-5 h-5" /><span>सुनें</span>
      </button>
      <button onClick={onPay} className="flex-1 py-3 bg-white rounded-xl text-green-600 font-bold hover:bg-emerald-50">
        Pay / भुगतान
      </button>
    </div>
  </div>
);

// Main Dashboard
export default function Dashboard() {
  const { language } = useLanguage();
  const { data: liveData } = useRealtimeData({}, 2000);
  const billingData = useBillingData();
  
  const [pumpOn, setPumpOn] = useState(false);
  const [pumpRuntime, setPumpRuntime] = useState(2.5);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const speakVoltage = () => {
    const v = liveData?.voltage?.toFixed(0) || 0;
    if (v > 250) speakText('खतरा! वोल्टेज बहुत ज्यादा है।', 'hi-IN');
    else if (v < 200) speakText('चेतावनी! वोल्टेज कम है।', 'hi-IN');
    else speakText(`वोल्टेज ${v} वोल्ट है। सब ठीक है।`, 'hi-IN');
    toast.success(`🔊 Voltage: ${v}V`);
  };

  const speakBill = () => {
    const amt = billingData.currentMonth?.amount || 0;
    const u = billingData.currentMonth?.units?.toFixed(0) || 0;
    speakText(`इस महीने का बिल ${amt} रुपये है। ${u} यूनिट बिजली इस्तेमाल हुई।`, 'hi-IN');
    toast.success(`🔊 Bill: ₹${amt}`);
  };

  const speakPump = () => {
    speakText(pumpOn ? 'पंप अभी चालू है।' : 'पंप अभी बंद है।', 'hi-IN');
    toast.success(`🔊 Pump: ${pumpOn ? 'ON' : 'OFF'}`);
  };

  const togglePump = () => {
    setPumpOn(!pumpOn);
    speakText(!pumpOn ? 'पंप चालू हो गया।' : 'पंप बंद हो गया।', 'hi-IN');
    toast.success(!pumpOn ? '✅ Pump ON' : '⏹️ Pump OFF');
  };

  const getVoltageStatus = () => {
    const v = liveData?.voltage || 0;
    if (v > 250) return 'danger';
    if (v < 200 || v > 240) return 'warning';
    return 'good';
  };

  const emergencyContacts = [
    { name: 'Electricity Board', nameHi: 'बिजली विभाग', phone: '1912' },
    { name: 'Gram Panchayat', nameHi: 'ग्राम पंचायत', phone: '1800-XXX-XXXX' },
    { name: 'Fire Emergency', nameHi: 'अग्निशमन', phone: '101' },
  ];

  const powerSchedule = [
    { start: 6, end: 10 },
    { start: 12, end: 14 },
    { start: 18, end: 22 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">🏠 Smart Meter</h1>
            <p className="text-blue-100 mt-1">स्मार्ट मीटर डैशबोर्ड</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-3 rounded-xl ${voiceEnabled ? 'bg-white/20' : 'bg-white/10'}`}>
              <Volume2 className={`w-6 h-6 ${voiceEnabled ? 'text-white' : 'text-white/50'}`} />
            </button>
            <div className={`w-3 h-3 rounded-full ${liveData?.voltage ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          </div>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          <button onClick={speakVoltage} className="px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30">🔊 Voltage सुनें</button>
          <button onClick={speakBill} className="px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30">🔊 Bill सुनें</button>
          <button onClick={speakPump} className="px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30">🔊 Pump Status</button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <BigStatusCard icon={Zap} label="Voltage" labelHi="वोल्टेज" 
          value={liveData?.voltage?.toFixed(0) || '---'} unit="V" 
          status={getVoltageStatus()} color="bg-yellow-500" onSpeak={speakVoltage} />
        
        <BigStatusCard icon={Zap} label="Current Power" labelHi="बिजली खपत"
          value={((liveData?.power || 0) / 1000).toFixed(1)} unit="kW"
          status="good" color="bg-blue-500" 
          onSpeak={() => { speakText(`बिजली खपत ${((liveData?.power || 0) / 1000).toFixed(1)} किलोवाट है`, 'hi-IN'); toast.success('🔊 Power'); }} />

        <PumpControlCard isOn={pumpOn} onToggle={togglePump} runtime={pumpRuntime} onSpeak={speakPump} />

        <CurrentBillCard 
          amount={billingData.currentMonth?.amount || 0}
          units={billingData.currentMonth?.units?.toFixed(0) || 0}
          dueDate="5 Jan 2026" onSpeak={speakBill}
          onPay={() => toast.success('Redirecting to payment...')} />

        <WeatherCard temp={28} humidity={65} condition="sunny" />
        <ElectricityScheduleCard schedule={powerSchedule} />

        <div className="md:col-span-2 lg:col-span-3">
          <EmergencyContactsCard contacts={emergencyContacts} />
        </div>
      </div>

      {/* Alert Banner */}
      {liveData?.voltage > 250 && (
        <div className="fixed bottom-4 left-4 right-4 bg-red-500 text-white p-4 rounded-xl shadow-lg animate-pulse flex items-center gap-3">
          <AlertTriangle className="w-6 h-6" />
          <div className="flex-1">
            <p className="font-bold">⚠️ High Voltage Alert!</p>
            <p className="text-sm">खतरा! वोल्टेज बहुत ज्यादा है ({liveData.voltage?.toFixed(0)}V)</p>
          </div>
          <button onClick={speakVoltage} className="p-2 bg-white/20 rounded-lg"><Volume2 className="w-5 h-5" /></button>
        </div>
      )}
    </div>
  );
}
