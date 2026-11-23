# AgriLynx — Smart Agriculture Intelligence

> **AgriLynx is currently a prototype. Sensor values shown in the demonstration are simulated unless explicitly connected to actual hardware. Image analysis is demonstrative unless a validated model is integrated.**

AgriLynx is a smart agriculture concept that combines environmental monitoring, IoT-style sensor information, crop image inspection and alerts in one web platform.

## Problem statement
Farmers may face difficulty monitoring environmental conditions, identifying potential crop stress, and obtaining timely insights for field management.

## Proposed solution
Combine environmental monitoring, IoT-based data acquisition, crop image analysis and risk alerts into a unified platform. This repository is the web front end of that idea, running on sample data.

## Features
| Area | What works today |
|---|---|
| Overview | KPIs, 24 h / 7 d environmental chart (with table view), field overview, rule-based attention list, activity feed |
| Farm Monitoring | Crop and field selection, per-parameter history, min/max, **editable thresholds** that update status and alerts live |
| Crop Intelligence | General information for tomato, rice, cotton, groundnut and a persistent monitoring checklist |
| Pest Analysis | Drag-and-drop upload, validation (JPG/PNG/WebP, ≤ 8 MB), preview, demo report, history |
| Alerts | Search, filter by severity/status/crop, details drawer, acknowledge, resolve, reopen, reset |
| System Architecture | Layered diagram with Concept / Prototype / Demonstration / Planned status |
| About | Problem, solution, objectives, limitations, future scope |

## Data transparency
| Item | Status |
|---|---|
| UI, threshold logic, alert rules, checklist, history, persistence | **Implemented** |
| Temperature, humidity, soil moisture, light readings | **Simulated** (deterministic sample data, snapshot 21 Nov 2026 11:00 IST). Not from sensors |
| Pest / damage report | **Demonstration**: a template scenario chosen from a hash of file name and size. It does **not** describe the image. No model, no confidence scores |
| Image properties (resolution, brightness, green / warm pixel share) | Real in-browser measurement; simple colour ratios, not a diagnosis |
| Crop condition score | Indicative score derived only from threshold rules |
| Default thresholds and crop notes | Illustrative and general; real needs depend on variety, stage, soil, location |
| ESP32, live data, cloud, validated ML | **Planned**, not implemented |

## Architecture
```
Field → Sensors (soil, temp, humidity, light) → ESP32 (planned) → Application layer → UI
```
Only the application layer and UI exist here. See the in-app **System Architecture** page.

Code layout: `src/data` (crops, fields, sensors, thresholds), `src/utils` (threshold engine, alert generation, image tools), `src/context` (state + localStorage), `src/components`, `src/pages`, `src/layouts`.

## Technology stack
React 19, TypeScript, Vite, Tailwind CSS 3, React Router, Recharts, Lucide icons, localStorage. No backend, no API keys.

## Installation and local execution
```bash
npm install
npm run dev        # development server
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

## Demo functionality
- Change a threshold on **Farm Monitoring** (e.g. Tomato soil minimum to 60) and watch status and **Alerts** update.
- Use **Reset demo** in the sidebar to clear all saved state, or **Reset demo alerts** on the Alerts page.
- Settings are stored in your browser only (localStorage keys prefixed `agrilynx:v1:`).

## Deployment (Vercel)
1. Push the project to GitHub.
2. In Vercel choose **Add New → Project**, import the repo.
3. Framework preset **Vite**, build command `npm run build`, output `dist`. No environment variables are needed.
`vercel.json` rewrites all routes to `index.html` so deep links work.

## Screenshots
Add your own captures here (e.g. `docs/overview.png`) after running the app.

## Limitations
- No physical sensors, ESP32, backend, accounts or cloud sync.
- No trained model; no accuracy claims.
- Not validated in the field.

## Future scope
ESP32 live integration, real-time data, cloud communication, validated ML pest detection, multispectral imaging, farm analytics, condition history, weather integration, irrigation decision support, SMS/WhatsApp alerts, regional languages, offline monitoring, multi-field management.
