# 33-Hour Development Plan — ChainCast-IDS

Goal: Deliver a minimally viable ChainCast-IDS prototype within 33 hours: collectors, backend ingestion, rule-based IDS, simple forecasting, dashboard, and on-chain incident logging (testnet).

Assumptions:
- Team: 2 people (Dev / DevOps) or solo with extended hours.
- Use Python (FastAPI) backend, Next.js frontend.

Hours 0–2 (Setup)
- Initialize repo, basic README, license (done).
- Create project skeleton: `src/collector`, `src/backend`, `src/models`, `frontend/`.
- Provision testnet RPC keys (Sepolia/Goerli) and store env vars.

Hours 2–8 (Collectors & Ingestion)
- Implement collector that polls RPC/WebSocket for gas, block time, tx volume.
- Normalize and push to a simple queue (Redis or in-memory pubsub).
- Add basic unit tests for collector parsing.

Hours 8–12 (Backend Processing & Rules)
- FastAPI service with endpoints `/metrics`, `/alerts`, and WebSocket for real-time updates.
- Implement rule-based engine with configurable rules (YAML/JSON).
- Add alert emitter (console + WebSocket).

Hours 12–18 (Forecasting & Stability Score)
- Implement simple forecasting: rolling-window moving average + short AR/MA model or exponential smoothing.
- Compute stability score (0–100) combining normalized features: gas volatility, block-time variance, failed_tx_rate.
- Expose API `/stability_score` and `/forecast`.

Hours 18–22 (Behavioral IDS)
- Add Z-score detector for single-metric anomalies.
- Add optional IsolationForest pipeline for multivariate anomaly detection (train on historical sample data).
- Add alert correlation (if rule + ML both fire → escalate).

Hours 22–26 (Dashboard MVP)
- Frontend Next.js: simple dashboard showing live stability score, chart of gas & block time, alerts timeline.
- Hook to WebSocket for live updates.

Hours 26–29 (On-chain Logging)
- Create a minimal Solidity contract to record incidents: incident type, severity, timestamp, ipfs/hash.
- Deploy to Sepolia using Hardhat/Foundry.
- Integrate backend to submit critical incidents to the contract (via wallet/private key guarded by env vars).

Hours 29–31 (Testing & Polish)
- Run end-to-end demo: simulate an attack (gas spike) and verify alerts, dashboard update, and on-chain log.
- Add README quickstart and demo script.

Hours 31–33 (Deliver & Handoff)
- Produce pitch slides, short demo video script, and commit/tag release.
- Prepare deployment notes and next steps for contributors.

Deliverables by Hour 33
- Running FastAPI backend and Next.js frontend with sample data
- Rule-based IDS and Z-score detection operational
- Stability score and short forecast endpoint
- On-chain incident logging to testnet
- Documentation and pitch materials

Optional stretch goals (post-33 hours)
- Full ML model training pipeline and backtesting
- Dashboard auth, multi-network support, and alert integrations (Slack/Discord)
