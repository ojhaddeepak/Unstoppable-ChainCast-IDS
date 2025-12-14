# 2-Minute Demo Pitch — ChainCast-IDS

1) Hook (15s)
- "Imagine predicting blockchain instability the same way meteorologists predict storms. ChainCast-IDS does that — and detects attacks early."

2) Problem (20s)
- Blockchains suffer downtime, forks, and attacks that are costly. Operators lack lightweight, research-grade tooling to forecast instability and correlate IDS telemetry.

3) Solution (40s)
- ChainCast-IDS combines time-series stability scoring and IDS-style signature/behavior detection.
- Demo: run the CLI to get a stability score and an alert when the system simulates an unstable reading.

4) Tech & Novelty (25s)
- Uses ML-based forecasting and anomaly detection (pluggable models).
- Designed for reproducible research and quick prototyping; integrates into alerting pipelines.

5) Call to Action (20s)
- For judges: see the demo command in the README, view the `src/main.py` demo, and try varying node inputs.
- We can extend this with live chain feeds, dashboards, and a small leaderboard for forecasting accuracy.
