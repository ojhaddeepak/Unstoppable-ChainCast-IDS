# System Architecture — ChainCast-IDS

Overview
- Diagram file: `docs/architecture.svg`
- Purpose: show data flow from collectors to dashboard and on-chain logging.

Components

1. Collectors
- Connect to RPC/WebSocket endpoints (public RPC, Alchemy, Infura, QuickNode).
- Ingest metrics: gas price, block time, tx volume, pending txs, failed tx rate.
- Lightweight agents or server-side fetchers with retries and rate-limit handling.

2. Ingestion Layer
- Normalize and timestamp incoming events.
- Buffer via a queue (Redis / RabbitMQ / in-memory pub/sub) for downstream processing.
- Provide REST + WebSocket endpoints for the dashboard.

3. Processing
- Rules Engine: fast, deterministic checks (thresholds, percent changes).
- Forecasting: short-term time-series models (moving averages, ARIMA, lightweight ML) for 1–6 hour forecasts.
- IDS (Behavioral): anomaly detection (z-score, rolling-window deviations, Isolation Forest) to flag unknown attack patterns.
- Alert generation with severities (Low, Medium, High, Critical).

4. Storage
- Time-series DB (InfluxDB / Timescale) or Postgres for historical metrics.
- Event store for alerts and incidents.
- Optional object store for forensic payloads.

5. Dashboard & On-chain Logging
- Frontend (Next.js + React + Tailwind + Charting libs) subscribes to WebSocket updates.
- Critical incidents can be written to a smart contract for tamper-proof logging.

Tech choices (examples)
- Backend: Python + FastAPI (or Node.js + Fastify)
- ML: scikit-learn, pandas, numpy
- RPC libs: ethers.js / web3.py
- Hosting: Vercel (frontend), Railway/Render (backend)

Security & Reliability Notes
- Secure API keys in environment variables and secrets manager.
- Rate limits on collectors and exponential backoff.
- Emit structured logs and metrics for observability.
