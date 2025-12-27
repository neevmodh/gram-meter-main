import paho.mqtt.client as mqtt
import json
import time
import random
import os
from datetime import datetime

# --- CONFIGURATION ---
STATE_FILE = "meter_hardware_state.json"
BROKER = "broker.hivemq.com"
TOPIC = "gram-meter/live/data"
DEMO_ACCELERATION = 60  # Speed up energy accumulation for the demo


def get_meter_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
            return json.load(f).get("cumulative_kwh", 0)
    # Start with ~250kWh baseline (simulated 25 days)
    return round(sum([random.uniform(8.0, 12.0) for _ in range(25)]), 4)


def save_meter_state(val):
    with open(STATE_FILE, "w") as f:
        json.dump({"cumulative_kwh": val}, f)


# --- MQTT SETUP ---
client = mqtt.Client(callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
client.connect(BROKER, 1883, 60)

cumulative_kwh = get_meter_state()
iteration = 0

print(f"📡 Hardware Meter Initialized. Baseline: {cumulative_kwh} kWh")

while True:
    iteration += 1
    now = datetime.now()

    # 1. THE STORYTELLER LOGIC (Demo Automation)
    # Every 15th reading, we force a "Grid Event" to show off the AI
    is_demo_event = (iteration % 15 == 0)

    if is_demo_event:
        # SCENARIO: Voltage Surge (Grid Instability)
        voltage = random.uniform(286, 305)
        pump_active = 1
        active_power = 7.5  # Spike in power due to inefficiency/fault
        event_msg = "!!! SIMULATING VOLTAGE SURGE !!!"
    else:
        # SCENARIO: Normal Operation
        voltage = 230.0 + random.uniform(-4, 4)
        pump_active = 1 if (random.random() < 0.3) else 0
        active_power = (pump_active * 4.5) + random.uniform(0.2, 0.7)
        event_msg = "Normal Operation"

    # 2. CALCULATE STABILITY (The feature the Brain expects)
    # The AI looks at deviation from 230V
    stability = abs(230 - voltage)

    # 3. ACCELERATED ENERGY MATH
    # In a 3-minute pitch, 1:1 time is too slow.
    # We multiply by DEMO_ACCELERATION so the "Cost" actually climbs.
    energy_consumed = (active_power * (2 / 3600)) * DEMO_ACCELERATION
    cumulative_kwh += energy_consumed
    save_meter_state(cumulative_kwh)

    # 4. DATA PACKET (Aligned with FINAL_HACKATHON_DATASET columns)
    payload = {
        "Global_active_power": round(active_power, 4),
        "Voltage": round(voltage, 2),
        "Irrigation_Pump": pump_active,
        "Voltage_Stability": round(stability, 2),  # CRITICAL: Fixed feature name
        "Energy_kWh": round(cumulative_kwh, 4),  # Standardized key
        "Day_of_Month": now.day,
        "Time": now.strftime("%H:%M:%S")
    }

    # 5. PUBLISH
    client.publish(TOPIC, json.dumps(payload))

    # CLEAN CONSOLE LOG
    print(f"[{now.strftime('%H:%M:%S')}] {event_msg}")
    print(f"   ⚡ {active_power:.2f}kW | 🔋 {voltage:.1f}V | 📈 Total: {cumulative_kwh:.2f}kWh")
    print("-" * 40)

    time.sleep(2)