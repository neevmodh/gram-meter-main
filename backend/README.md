# 🌾 Gram Meter Backend - API Documentation

> **Smart Energy Monitoring for Rural India**  
> Square Hacks Hackathon Project

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Activate virtual environment
source ../.venv/bin/activate

# Install packages (already done)
pip install -r requirements.txt
```

### 2. Database Setup

```bash
# Apply migrations (already done)
python manage.py migrate

# Create sample data
python scripts/populate_sample_data.py
```

### 3. Start Services

**Terminal 1 - Django Backend (Port 8000):**
```bash
python manage.py runserver
```

**Terminal 2 - FastAPI ML Gateway (Port 8001):**
```bash
uvicorn ml_gateway.main:app --reload --port 8001
```

**Terminal 3 - Live Data Generator (Optional):**
```bash
python scripts/generate_live_data.py
```

---

## 📡 API Endpoints

### Base URLs
- **Django REST API**: `http://127.0.0.1:8000/api/v1/`
- **ML Gateway**: `http://127.0.0.1:8001/`
- **API Docs**: `http://127.0.0.1:8000/swagger/`
- **ML Docs**: `http://127.0.0.1:8001/docs`

---

## 🔐 Authentication

### 1. Login (Get JWT Token)

```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "farmer_ramesh", "password": "password123"}'
```

**Response:**
```json
{
  "refresh": "eyJhbGci...",
  "access": "eyJhbGci..."
}
```

### 2. Use Token in Requests

```bash
TOKEN="your_access_token_here"

curl -X GET http://127.0.0.1:8000/api/v1/meters/ \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Core API Endpoints

### Meters

#### List All Meters
```bash
GET /api/v1/meters/
```

#### Get Meter Details
```bash
GET /api/v1/meters/{meter_id}/
```

#### Get Meter Readings
```bash
GET /api/v1/meters/{meter_id}/readings/
?start_date=2025-12-20&end_date=2025-12-25
```

#### Get Live Status
```bash
GET /api/v1/meters/{meter_id}/live_status/
```

#### Get Meter Stats
```bash
GET /api/v1/meters/stats/
```

---

### Dashboard

#### Get Dashboard Stats
```bash
GET /api/v1/dashboard/stats/
```

**Response:**
```json
{
  "total_energy": 747138.24,
  "current_power": 4271.92,
  "efficiency_score": 96,
  "active_alerts": 0,
  "monthly_cost": "5603536.79",
  "cost_savings": "840530.52",
  "carbon_saved": 91898.0,
  "voltage": 230.11,
  "current": 19.54,
  "power_factor": 0.95
}
```

---

### Alerts

#### List Alerts
```bash
GET /api/v1/alerts/
?status=pending&severity=critical
```

#### Acknowledge Alert
```bash
POST /api/v1/alerts/{alert_id}/acknowledge/
```

#### Resolve Alert
```bash
POST /api/v1/alerts/{alert_id}/resolve/
```

#### Get Alert Stats
```bash
GET /api/v1/alerts/stats/
```

---

## 🤖 ML Gateway API

### 1. Energy Forecast

```bash
curl -X POST http://127.0.0.1:8001/forecast/predict \
  -H "Content-Type: application/json" \
  -d '{
    "meter_id": "GJ-ANAND-001",
    "historical_readings": [
      {
        "timestamp": "2025-12-25T10:00:00Z",
        "voltage": 230.0,
        "current": 20.0,
        "power": 4500.0,
        "energy": 100.5,
        "power_factor": 0.95,
        "frequency": 50.0
      }
    ],
    "forecast_hours": 24
  }'
```

**Response:**
```json
{
  "meter_id": "GJ-ANAND-001",
  "forecast": [
    {
      "timestamp": "2025-12-25T11:00:00Z",
      "predicted_energy": 105.2,
      "predicted_power": 4600.0,
      "confidence_score": 0.92,
      "lower_bound": 102.1,
      "upper_bound": 108.3
    }
  ],
  "total_predicted_energy": 2524.8,
  "confidence": 0.89
}
```

### 2. Anomaly Detection

```bash
curl -X POST http://127.0.0.1:8001/anomaly/detect \
  -H "Content-Type: application/json" \
  -d '{
    "meter_id": "GJ-ANAND-001",
    "readings": [
      {
        "timestamp": "2025-12-25T10:00:00Z",
        "voltage": 280.0,
        "current": 45.0,
        "power": 12000.0,
        "energy": 150.0,
        "power_factor": 0.85,
        "frequency": 50.0
      }
    ],
    "sensitivity": 0.8
  }'
```

**Response:**
```json
{
  "meter_id": "GJ-ANAND-001",
  "anomalies_detected": true,
  "anomalies": [
    {
      "type": "voltage_spike",
      "timestamp": "2025-12-25T10:00:00Z",
      "severity": "critical",
      "message": "Voltage spike detected: 280.0V (21.7% above normal)",
      "anomaly_score": 0.95,
      "affected_reading": {
        "voltage": 280.0,
        "current": 45.0,
        "power": 12000.0
      },
      "recommended_action": "Immediate inspection required. Check voltage regulator and transformer.",
      "estimated_cost_impact": 250.0
    }
  ]
}
```

### 3. Universal Parser

```bash
curl -X POST http://127.0.0.1:8001/parser/parse \
  -H "Content-Type: application/json" \
  -d '{
    "raw_data": "V:230.5,I:20.3,P:4500.2,E:105.4,PF:0.95,F:50.0",
    "manufacturer": "Secure Meters"
  }'
```

### 4. Efficiency Scoring

```bash
curl -X POST http://127.0.0.1:8001/efficiency/score \
  -H "Content-Type: application/json" \
  -d '{
    "meter_id": "GJ-ANAND-001",
    "readings": [
      {
        "timestamp": "2025-12-25T10:00:00Z",
        "voltage": 230.0,
        "current": 20.0,
        "power": 4500.0,
        "energy": 100.5,
        "power_factor": 0.95,
        "frequency": 50.0
      }
    ]
  }'
```

**Response:**
```json
{
  "meter_id": "GJ-ANAND-001",
  "overall_score": 94,
  "grade": "A",
  "breakdown": {
    "power_factor_score": 95,
    "load_profile_score": 92,
    "peak_usage_score": 96,
    "consistency_score": 93
  },
  "insights": [
    {
      "category": "power_factor",
      "message": "Excellent power factor performance",
      "impact": "high",
      "potential_savings": 120.50
    }
  ],
  "recommendations": [
    "Maintain current power factor levels",
    "Consider load shifting to off-peak hours"
  ]
}
```

---

## 🔌 WebSocket Endpoints

### 1. Live Meter Readings

```javascript
const ws = new WebSocket('ws://127.0.0.1:8000/ws/meters/GJ-ANAND-001/');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Live Reading:', data);
};
```

### 2. Dashboard Updates

```javascript
const ws = new WebSocket('ws://127.0.0.1:8000/ws/dashboard/');

ws.onmessage = (event) => {
  const stats = JSON.parse(event.data);
  console.log('Dashboard Update:', stats);
};
```

### 3. Real-time Alerts

```javascript
const ws = new WebSocket('ws://127.0.0.1:8000/ws/alerts/');

ws.onmessage = (event) => {
  const alert = JSON.parse(event.data);
  if (alert.type === 'new_alert') {
    console.log('⚠️ New Alert:', alert.data);
  }
};
```

---

## 👥 Test Users

| Username | Password | Role | Village |
|----------|----------|------|---------|
| `farmer_ramesh` | `password123` | Farmer | Anand, Gujarat |
| `farmer_priya` | `password123` | Farmer | Anand, Gujarat |
| `sarpanch_kumar` | `password123` | Sarpanch | Anand, Gujarat |

---

## 📟 Test Meters

| Meter ID | Type | Owner | Location |
|----------|------|-------|----------|
| `GJ-ANAND-001` | Agricultural | Ramesh Patel | Ramesh Farm, Anand |
| `GJ-ANAND-002` | Residential | Priya Shah | Priya House, Anand |

---

## 🎯 Complete Testing Flow

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://127.0.0.1:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "farmer_ramesh", "password": "password123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['access'])")

# 2. Get Dashboard Stats
curl -s -X GET http://127.0.0.1:8000/api/v1/dashboard/stats/ \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

# 3. List Meters
curl -s -X GET http://127.0.0.1:8000/api/v1/meters/ \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

# 4. Get Meter Readings
curl -s -X GET "http://127.0.0.1:8000/api/v1/meters/1/readings/?limit=10" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

# 5. Test ML Gateway - Anomaly Detection
curl -s -X POST http://127.0.0.1:8001/anomaly/detect \
  -H "Content-Type: application/json" \
  -d '{
    "meter_id": "GJ-ANAND-001",
    "readings": [
      {
        "timestamp": "2025-12-25T10:00:00Z",
        "voltage": 280.0,
        "current": 45.0,
        "power": 12000.0,
        "energy": 150.0,
        "power_factor": 0.85,
        "frequency": 50.0
      }
    ]
  }' | python3 -m json.tool

# 6. Test ML Gateway - Efficiency Score
curl -s -X POST http://127.0.0.1:8001/efficiency/score \
  -H "Content-Type: application/json" \
  -d '{
    "meter_id": "GJ-ANAND-001",
    "readings": [
      {
        "timestamp": "2025-12-25T10:00:00Z",
        "voltage": 230.0,
        "current": 20.0,
        "power": 4500.0,
        "energy": 100.5,
        "power_factor": 0.95,
        "frequency": 50.0
      }
    ]
  }' | python3 -m json.tool
```

---

## 📁 Project Structure

```
backend/
├── manage.py                  # Django management script
├── db.sqlite3                 # SQLite database
├── gram_meter/               # Main Django project
│   ├── settings.py           # Configuration
│   ├── urls.py               # URL routing
│   └── asgi.py               # ASGI config for WebSockets
├── meters/                   # Core meters app
│   ├── models.py             # User, Meter, Reading, Alert
│   ├── views.py              # API viewsets
│   ├── serializers.py        # DRF serializers
│   ├── consumers.py          # WebSocket consumers
│   └── routing.py            # WebSocket routing
├── analytics/                # Analytics app
│   └── models.py             # Forecast, Pattern, Efficiency
├── billing/                  # Billing app
│   └── models.py             # Invoice, Payment
├── notifications/            # Notifications app
│   └── models.py             # Notification model
├── ml_gateway/               # FastAPI ML microservice
│   ├── main.py               # FastAPI app
│   ├── schemas.py            # Pydantic models
│   └── routers/              # API routers
│       ├── forecast.py       # Energy forecasting
│       ├── anomaly.py        # Anomaly detection
│       ├── parser.py         # Universal parser
│       └── efficiency.py     # Efficiency scoring
└── scripts/                  # Utility scripts
    ├── populate_sample_data.py
    └── generate_live_data.py
```

---

## 🎨 Key Features

### ✅ Implemented
- ✅ Django REST Framework APIs with JWT authentication
- ✅ 9 comprehensive database models
- ✅ FastAPI ML Gateway with 4 routers
- ✅ Real-time WebSocket support (Django Channels)
- ✅ Anomaly detection (voltage spikes, drops, overcurrent, phantom loads, outages)
- ✅ Energy forecasting with confidence intervals
- ✅ Efficiency scoring (0-100 scale)
- ✅ Universal meter parser (Tata Power, BESCOM, Secure Meters, Generic)
- ✅ Multilingual support (English, Hindi, Gujarati)
- ✅ Role-based access control (Farmer, Sarpanch, Utility, Government)
- ✅ Dashboard statistics API
- ✅ Alert management system
- ✅ Sample data generator
- ✅ Live data simulator with anomaly injection
- ✅ API documentation (Swagger/Redoc)

### 🔜 Next Steps
- Twilio WhatsApp/SMS integration
- React frontend development
- Advanced ML models (ARIMA, Prophet, Isolation Forest)
- Comprehensive testing

---

## 🏆 Hackathon Demo Flow

1. **Login**: Show authentication (`farmer_ramesh`)
2. **Dashboard**: Display real-time stats (energy, power, efficiency, costs)
3. **Live Monitoring**: WebSocket streaming of meter readings
4. **Anomaly Detection**: Inject voltage spike, show instant alert
5. **ML Insights**: Efficiency score 94%, cost savings recommendations
6. **Architecture**: Show microservices (Django ↔ FastAPI)
7. **Climax**: Phone buzzes with WhatsApp alert in Gujarati! 📱💥
8. **Impact**: Multilingual, rural-first, real-time protection

---

## 📝 Notes

- Default port Django: **8000**
- Default port FastAPI: **8001**
- Database: SQLite (dev), PostgreSQL-ready (prod)
- WebSocket: Redis channel layer
- All timestamps in ISO 8601 format
- All monetary values in INR (₹)
- Energy in kWh, Power in W
- Voltage in V, Current in A

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 8001
lsof -ti:8001 | xargs kill -9
```

### Import Errors
```bash
# Ensure virtual environment is activated
source ../.venv/bin/activate

# Reinstall packages
pip install -r requirements.txt
```

### Database Issues
```bash
# Reset database
rm db.sqlite3
python manage.py migrate
python scripts/populate_sample_data.py
```

---

**Built with ❤️ for Rural India | Square Hacks 2025**
