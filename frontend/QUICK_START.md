# 🚀 Gram Meter - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Install & Run
```bash
npm install
npm run dev
```
**That's it!** Open http://localhost:5173

---

## 🎯 What You'll See

### Dashboard Features:
- 📊 **Live Usage**: Real-time power meter (updates every 3s)
- 💰 **Daily Cost**: Today's electricity cost in ₹
- 🏆 **Efficiency Score**: A+ grade with gamification
- 📈 **24-Hour Chart**: Beautiful usage analytics
- 🚨 **Smart Alerts**: Voltage spikes, peak hours warnings
- 📱 **WhatsApp Sim**: Demo alert notification button

### Multilingual Support:
- Click the **globe icon** (top right)
- Select: English / हिंदी / ગુજરાતી
- Instant translation of all text

---

## 🔌 Connect to Django Backend

### Option 1: Environment Variable
```bash
# Create .env file
echo "VITE_API_URL=http://localhost:8000/api" > .env
npm run dev
```

### Option 2: Edit Config
Open `src/constants/config.js`:
```javascript
export const API_CONFIG = {
  BASE_URL: 'http://your-backend:8000/api',
  // ...
};
```

---

## 🧪 Testing Features

### 1. Real-Time Updates
- Watch the **Live Usage** card
- Value changes every 3 seconds
- Simulates fluctuating power consumption

### 2. Multilingual
- Click globe icon → Select Hindi
- All text changes instantly
- Selection saved in localStorage

### 3. Alerts
- See voltage spike alert (red card)
- See peak hours alert (amber card)
- Click "Ack" to acknowledge

### 4. WhatsApp Simulation
- Click **"Simulate WhatsApp Alert"** button
- See toast notification
- Message details displayed

### 5. Offline Mode
- Open DevTools → Network tab
- Set to "Offline"
- Dashboard still works!
- See "Offline Mode" indicator
- Shows cached data

---

## 📱 Mobile Testing

### Chrome DevTools
1. Press `F12`
2. Click mobile icon (top left)
3. Select device: iPhone 12 Pro
4. Test touch interactions

### Responsive Breakpoints
- **Mobile**: < 768px (1 column)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (3 columns)

---

## 🎨 Customization

### Change Primary Color
**File:** `tailwind.config.js`
```javascript
colors: {
  mint: {
    500: '#your-color',  // Change this
  }
}
```

### Add New Language
**File:** `src/constants/translations.js`
```javascript
export const translations = {
  // Add your language here
  es: {
    title: "Gram Meter",
    liveUsage: "Uso en Vivo",
    // ...
  }
};
```

### Adjust Polling Rate
**File:** `src/constants/config.js`
```javascript
export const POLLING_CONFIG = {
  METER_DATA_INTERVAL: 5000,  // 5 seconds
  ALERTS_INTERVAL: 15000,      // 15 seconds
};
```

---

## 🐛 Common Issues

### ❌ "Cannot GET /api/meter-data"
**Solution:** Backend not running or wrong URL
```bash
# Check .env file
VITE_API_URL=http://localhost:8000/api
```

### ❌ Blank screen
**Solution:** Check console for errors
```bash
# Clear cache and rebuild
rm -rf node_modules
npm install
npm run dev
```

### ❌ Charts not showing
**Solution:** Verify data format
```javascript
// Expected format:
usage_history: [
  { time: "00:00", usage: 0.8 },
  { time: "02:00", usage: 0.6 }
]
```

---

## 📦 File Structure Guide

```
src/
├── pages/
│   └── Dashboard.jsx       ← Main page, START HERE
├── components/
│   ├── KPICard.jsx         ← Metric cards
│   ├── AlertCard.jsx       ← Alert notifications
│   ├── UsageChart.jsx      ← Charts
│   └── Navbar.jsx          ← Top navigation
├── services/
│   ├── api.js              ← API calls
│   └── storage.js          ← localStorage
├── constants/
│   ├── config.js           ← Settings
│   └── translations.js     ← Languages
└── hooks/
    └── useApi.js           ← Custom hooks
```

---

## 🎯 Key Commands

```bash
# Development
npm run dev          # Start dev server (port 5173)

# Production
npm run build        # Build for production (dist/)
npm run preview      # Preview production build

# Code Quality
npm run lint         # Check code quality
```

---

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full |
| Firefox | 88+     | ✅ Full |
| Safari  | 14+     | ✅ Full |
| Edge    | 90+     | ✅ Full |
| Opera   | 76+     | ✅ Full |

---

## 📚 Learn More

- **Full Documentation:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
- **Project Overview:** [README_NEW.md](README_NEW.md)
- **Summary:** [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

---

## 🆘 Need Help?

### Check Console
```javascript
// Open browser console (F12)
// Look for errors or warnings
```

### Enable Debug Mode
```bash
# .env file
VITE_DEBUG=true
```

### Test API
```bash
# Test backend connection
curl http://localhost:8000/api/meter-data/
```

---

## ✅ Checklist

Before demo/deployment:

- [ ] `npm install` completed
- [ ] Dev server running (`npm run dev`)
- [ ] Dashboard loads at localhost:5173
- [ ] Live usage updates visible
- [ ] Language switching works
- [ ] Alerts showing
- [ ] Chart displays
- [ ] WhatsApp button works
- [ ] Mobile responsive (F12 → mobile view)
- [ ] Offline mode tested

---

## 🎉 You're Ready!

Your Gram Meter dashboard is now running!

**Features Working:**
✅ Real-time monitoring  
✅ Multilingual support  
✅ Smart alerts  
✅ Usage analytics  
✅ Offline mode  
✅ Mobile responsive  

---

**Built with ⚡ for Rural India**

**Questions?** Check the documentation files or console output.
