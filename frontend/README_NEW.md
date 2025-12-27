# 🌾 Gram Meter - Smart Electricity Dashboard for Rural India

<div align="center">

**Revolutionizing Rural Electricity Management Through Smart Meter Technology**

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 🎯 Overview

**Gram Meter** is a cutting-edge smart meter dashboard designed specifically for rural India, addressing the unique challenges faced by farmers and rural households in managing their electricity consumption. Built for the "Next Billion Users," this application delivers high-performance, multilingual, and offline-first functionality in low-connectivity environments.

### 🌟 Key Features

#### 1. **Smart Dashboard** 🎛️
- **Real-Time Monitoring**: Live power usage updates every 3 seconds
- **Cost Tracking**: Daily, weekly, and monthly electricity costs in ₹
- **Efficiency Score**: Gamified A-F grading system (0-100%) for consumption patterns
- **Usage Analytics**: 24-hour consumption trends with beautiful area charts

#### 2. **AI-Powered Intelligence** 🧠
- **Anomaly Detection**: Automatic identification of voltage spikes and unusual patterns
- **Usage Forecasting**: Predictive bill estimation to prevent "bill shock"
- **Smart Alerts**: Real-time warnings for critical events (voltage spikes, high usage, etc.)
- **Pattern Learning**: Analyzes consumption to provide personalized recommendations

#### 3. **Rural-First Design** 🌍
- **Multilingual Support**: Instant switching between English, Hindi, and Gujarati
- **Offline-First Architecture**: Works seamlessly with cached data when offline
- **Low-Bandwidth Optimized**: < 500KB initial load, code splitting for heavy components
- **WhatsApp Integration**: Zero-UI alert notifications via WhatsApp/SMS
- **Mobile Responsive**: Touch-optimized with 44px minimum tap targets

#### 4. **Glassmorphism UI** ✨
- **Modern Design**: Frosted glass effect with backdrop blur
- **Mint & Emerald Theme**: Trustworthy, energy-focused color palette
- **High Contrast**: Readable in bright sunlight
- **Smooth Animations**: 60fps transitions and micro-interactions

---

## 🏗️ Architecture

### **Project Structure**

```
gram-meter/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AlertCard.jsx
│   │   ├── EfficiencyBadge.jsx
│   │   ├── KPICard.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   └── UsageChart.jsx
│   ├── contexts/            # React contexts
│   │   └── LanguageContext.jsx
│   ├── hooks/               # Custom React hooks
│   │   └── useApi.js
│   ├── pages/               # Page components
│   │   └── Dashboard.jsx
│   ├── services/            # API and storage services
│   │   ├── api.js
│   │   └── storage.js
│   ├── utils/               # Helper functions
│   │   └── helpers.js
│   ├── constants/           # Configuration constants
│   │   ├── config.js
│   │   └── translations.js
│   ├── assets/              # Static assets
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Public assets
├── .env.example             # Environment variables template
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ and npm/yarn
- Django REST Framework backend (running on `localhost:8000` by default)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gram-meter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Django backend URL
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

---

## 🔌 Backend Integration

### **Expected Django API Endpoints**

```python
# Base URL: http://localhost:8000/api

GET  /meter-data/           # Real-time meter data
GET  /alerts/               # Smart alerts list
POST /simulate-alert/       # Simulate WhatsApp alert
GET  /usage-forecast/       # Bill forecast
GET  /anomalies/            # Detected anomalies
GET  /efficiency-score/     # Efficiency calculation
GET  /appliances/           # Connected appliances
POST /alerts/{id}/acknowledge/  # Acknowledge alert
```

### **Sample API Response**

```json
{
  "current_power": 1.8,
  "daily_cost": 45.20,
  "efficiency_score": 94,
  "efficiency_grade": "A+",
  "usage_history": [
    { "time": "00:00", "usage": 0.8 },
    { "time": "02:00", "usage": 0.6 }
  ],
  "today_usage": 28.5,
  "this_week_usage": 185.2,
  "this_month_usage": 756.8
}
```

---

## 🎨 Design System

### **Colors**

- **Primary**: Emerald 500 (`#10b981`)
- **Secondary**: Teal 500
- **Background**: Gradient from Slate 50 to Emerald 50
- **Text**: Slate 800 (high contrast)

### **Typography**

- **Headings**: Outfit (700-900 weight)
- **Body**: Inter (400-600 weight)

### **Components**

All components follow the **glassmorphism** design pattern with:
- `backdrop-blur-md` for frosted glass effect
- Semi-transparent backgrounds (`bg-white/80`)
- Subtle borders (`border-slate-100`)
- Smooth hover transitions

---

## 🌐 Multilingual Support

Supports 3 languages with instant switching:

- 🇬🇧 **English** (Default)
- 🇮🇳 **Hindi** (हिंदी)
- 🇮🇳 **Gujarati** (ગુજરાતી)

Language preference is persisted in `localStorage`.

---

## 📱 Mobile Optimization

- **Responsive Grid**: Auto-adjusting columns for all screen sizes
- **Touch Targets**: Minimum 44x44px for easy tapping
- **Fast Loading**: Code splitting with React.lazy
- **Offline Support**: Service Worker ready (PWA-compatible)

---

## 🔒 Offline-First Strategy

1. **Optimistic UI**: Shows cached data immediately
2. **Background Sync**: Fetches fresh data in background
3. **Graceful Degradation**: Falls back to mock data if no cache
4. **Network Detection**: Real-time online/offline indicators

---

## 🧪 Testing

```bash
# Run linter
npm run lint

# Preview production build
npm run preview
```

---

## 🚢 Deployment

### **Vercel / Netlify**

1. Connect your Git repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL`

### **Docker**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Made with ⚡ for the Next Billion Users**

</div>
