# Village Grid Dashboard (Vite + React)

Run locally:

1. Install dependencies

```bash
npm install
```

2. Start dev server

```bash
npm run dev
```

3. Open the URL printed by Vite (usually http://localhost:5173)

Notes:
- The app subscribes to MQTT topic `gram-meter/village/map` on `broker.hivemq.com` via WebSockets.
- The existing `virtual_meter_gov.py` script in the workspace publishes simulated telemetry every 2s; keep it running to see live updates.
