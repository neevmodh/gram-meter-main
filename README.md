# 🌾 Gram Meter
> **Bridging the Gap Between Grid and Grassroots**  
> *A Smart Energy Monitoring Platform for Rural India*

![Project Status](https://img.shields.io/badge/Status-Hackathon%20Ready-success)
![Python](https://img.shields.io/badge/Backend-Django%20%7C%20FastAPI-blue)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![ML](https://img.shields.io/badge/AI-Scikit--Learn%20%7C%20LSTM-orange)

---

## 📖 Overview

**Gram Meter** is an enterprise-grade smart energy monitoring solution designed specifically for rural India. It empowers farmers, village leaders (Sarpanch), and utility providers with real-time insights into electricity consumption, quality, and efficiency.

By combining **IoT data**, **Machine Learning**, and **Multilingual support**, Gram Meter addresses critical challenges like voltage fluctuations, power theft, and inefficient usage patterns.

---

## 🌟 Key Features

### 🔐 Enterprise-Grade Security
- **Mobile-First Authentication**: OTP-based login (no passwords required).
- **Device Fingerprinting**: Tracks user devices and prevents session hijacking.
- **Role-Based Access Control (RBAC)**:
  - 👨‍🌾 **Farmer**: View personal consumption, bills, and alerts.
  - 🏛️ **Sarpanch**: Village-level overview and critical infrastructure monitoring.
  - ⚡ **Utility Provider**: Grid load balancing and theft detection.
  - 🇮🇳 **Government**: Policy planning and subsidy management.

### 📊 Advanced Analytics & ML
- **Real-Time Monitoring**: Live tracking of Voltage, Current, Power, and Frequency.
- **Anomaly Detection**: AI-powered detection of:
  - ⚡ Voltage Spikes/Drops
  - 🔌 Phantom Loads
  - ⚠️ Power Theft/Tampering
  - 🌑 Power Outages
- **Smart Forecasting**: 7-day energy consumption predictions using LSTM models.
- **Efficiency Scoring**: A-F grading system for energy usage with actionable recommendations.

### 🌍 Rural-Optimized Design
- **Multilingual Interface**: Full support for **English**, **Hindi**, and **Gujarati**.
- **Offline Capabilities**: Works reliably on low-bandwidth networks.
- **Multi-Channel Alerts**: Notifications via SMS, WhatsApp, and Email.

---

## 🏗️ Architecture

The platform follows a modern microservices-inspired architecture:

- **Backend Core**: Django 6.0 (User management, Billing, Notifications).
- **ML Gateway**: FastAPI (High-performance inference for Forecasting & Anomalies).
- **Frontend**: React + Vite (Responsive, PWA-ready UI).
- **Database**: SQLite (Dev) / PostgreSQL (Prod).
- **Real-Time Layer**: Redis + Django Channels (WebSockets).

---

## 🚀 Getting Started

### Prerequisites
- **Python** 3.10+
- **Node.js** 16+
- **Redis** (for WebSockets and Caching)

### 📥 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Jaimin2687/gram-meter.git
   cd gram-meter
   ```

2. **Setup Backend**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r backend/requirements.txt
   
   # Initialize Database
   cd backend
   python manage.py migrate
   python scripts/populate_sample_data.py  # Generates test users & data
   cd ..
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

---

## 🏃‍♂️ How to Run

### Option 1: One-Click Startup (Recommended)
We provide a unified script to start the Backend, Frontend, and Admin Console simultaneously.

**Mac/Linux:**
```bash
./start_platform.sh
```

**Windows:**
```bat
start_platform.bat
```

### Option 2: Manual Startup

**Terminal 1: Django Backend**
```bash
source .venv/bin/activate
cd backend
python manage.py runserver
```

**Terminal 2: Frontend Application**
```bash
cd frontend
npm run dev
```

**Terminal 3: ML Gateway (Optional)**
```bash
source .venv/bin/activate
cd backend
uvicorn ml_gateway.main:app --reload --port 8001
```

---

## 🧪 Demo Credentials

Use these accounts to explore different roles:

| Role | Username | Password | Phone |
|------|----------|----------|-------|
| **Farmer** | `farmer_ramesh` | `password123` | `+917012345678` |
| **Sarpanch** | `sarpanch_kumar` | `password123` | `+919876543210` |

> **Note**: In development mode, the OTP will be printed in the backend console.

---

## 📡 API Documentation

The backend provides a comprehensive REST API. Once the server is running, access the interactive documentation:

- **Swagger UI**: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- **ReDoc**: [http://localhost:8000/api/redoc/](http://localhost:8000/api/redoc/)

### Key Endpoints
- `POST /api/v1/auth/login/` - Request OTP
- `GET /api/v1/meters/` - List smart meters
- `GET /api/v1/analytics/forecast/` - Get energy predictions
- `POST /api/v1/analytics/ml/detect_anomaly/` - Real-time anomaly check

---

## 📂 Project Structure

```
gram-meter/
├── backend/                 # Django Project Root
│   ├── analytics/           # ML & Data Analysis App
│   ├── billing/             # Invoicing & Payments
│   ├── core/                # User Auth & Role Management
│   ├── meters/              # Smart Meter Management
│   ├── ml_gateway/          # FastAPI Microservice
│   └── scripts/             # Data Generators & Utilities
├── frontend/                # React + Vite Application
│   ├── src/
│   │   ├── components/      # Reusable UI Components
│   │   ├── pages/           # Application Views
│   │   └── services/        # API Integration
├── ML/                      # Machine Learning Models (.pkl)
└── Admin console/           # Government/Utility Admin Panel
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Built with ❤️ for Square Hacks 2025**
