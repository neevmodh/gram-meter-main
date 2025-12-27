# Gram Meter Frontend

React + Vite frontend application for the Gram Meter smart energy monitoring platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Backend Django server running on `http://127.0.0.1:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

## 🔐 Demo Credentials

Use these credentials to login:

- **Username:** `farmer_ramesh`
- **Password:** `password123`

Other test users:
- `farmer_priya` / `password123`
- `sarpanch_kumar` / `password123`

## 📁 Project Structure

```
src/
├── components/
│   └── Layout.jsx          # Main app layout with sidebar
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Dashboard.jsx       # Dashboard with stats & overview
│   └── LiveMonitoring.jsx  # Real-time meter monitoring
├── services/
│   └── api.js              # Axios API client
├── App.jsx                 # React Router setup
└── main.jsx                # App entry point
```

## 🎨 Features

### ✅ Implemented
- **Login System:** JWT-based authentication
- **Dashboard:** 
  - Real-time energy stats
  - Active meters list
  - Recent alerts
- **Live Monitoring:**
  - Meter selection
  - Real-time readings (V, A, W, kWh, PF, Hz)
  - Auto-refresh every 5 seconds
  - Readings history table
- **Protected Routes:** Authentication required for all pages
- **Responsive Design:** Tailwind CSS styling

### 🚧 Placeholder Pages
- Analytics
- Alerts
- Billing
- Settings

## 🔌 API Integration

The frontend connects to the Django backend at `http://127.0.0.1:8000/api/v1`

Available API endpoints:
- `POST /auth/login/` - User login
- `GET /auth/user/` - Get user profile
- `GET /dashboard/stats/` - Dashboard statistics
- `GET /meters/` - List all meters
- `GET /meters/{id}/` - Get meter details
- `GET /meters/{id}/readings/` - Get meter readings
- `GET /alerts/` - List all alerts

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 📦 Dependencies

- **React 19.2.0** - UI library
- **React Router DOM 7.11.0** - Routing
- **Axios 1.13.2** - HTTP client
- **Vite 7.2.4** - Build tool
- **Tailwind CSS** (via CDN) - Styling

## 🔒 Authentication Flow

1. User enters credentials on login page
2. Frontend sends POST request to `/api/v1/auth/login/`
3. Backend returns JWT access & refresh tokens
4. Tokens stored in localStorage
5. All subsequent API requests include Bearer token
6. If token expires (401), user redirected to login

## 📝 Notes

- All pages except `/login` require authentication
- Tokens stored in localStorage: `accessToken`, `refreshToken`, `user`
- API automatically adds Bearer token to all requests
- Live monitoring auto-refreshes every 5 seconds
- Sidebar can be collapsed for more screen space

## 🐛 Troubleshooting

### White screen issue
- Check browser console for errors
- Verify backend is running on port 8000
- Clear localStorage and try logging in again

### API connection failed
- Ensure Django backend is running: `python manage.py runserver`
- Check CORS settings in Django
- Verify API baseURL in `src/services/api.js`

### Login not working
- Verify user exists in database
- Check Django logs for authentication errors
- Ensure JWT tokens are being returned

## 🎯 Next Steps

To complete the platform, implement:
1. Analytics page with charts (Chart.js/Recharts)
2. Alerts management page (acknowledge, filter)
3. Billing page with invoices
4. Settings page (profile, notifications)
5. WebSocket integration for real-time updates
6. Dark mode toggle
7. Multi-language support (Hindi/English)

---

Built for **Square Hacks** | Rural India Smart Energy Initiative 🌾
