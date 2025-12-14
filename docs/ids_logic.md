# IDS Detection Logic — ChainCast-IDS

This document contains rule-based and behavior-based pseudocode for ChainCast-IDS.

## 1) Rule-Based Detection (Deterministic)

Example rules:
- Gas spike: if current_gas > 3x(median_last_60m_gas) => raise High
- Failed txs: if failed_tx_rate > 0.30 => raise Critical
- Pending queue: if pending_txs > threshold_for_network => raise Medium

Pseudocode:

```
function evaluate_rules(metrics):
    alerts = []
    if metrics.gas_price > 3 * median(metrics.gas_price, last=60):
        alerts.append(make_alert('Gas Spike', 'High'))
    if metrics.failed_tx_ratio > 0.30:
        alerts.append(make_alert('Failed TXs', 'Critical'))
    if metrics.pending_txs > pending_threshold(metrics.network):
        alerts.append(make_alert('Pending TXs High', 'Medium'))
    return alerts
```

Tune thresholds per-network and allow rule overrides via config files.

## 2) Behavior-Based Detection (Statistical + ML)

Techniques:
- Rolling window moving average and standard deviation (Z-score)
- Exponential Weighted Moving Average (EWMA) for smoothing
- Isolation Forest for multivariate anomaly detection (optional)

Pseudocode — Z-score anomaly for a metric:

```
function detect_zscore_anomaly(series, window=60, z_thresh=3.0):
    ma = rolling_mean(series, window)
    sigma = rolling_std(series, window)
    last_val = series[-1]
    z = abs((last_val - ma[-1]) / (sigma[-1] + EPS))
    if z > z_thresh:
        return True, z
    return False, z
```

Pseudocode — multivariate Isolation Forest (sketch):

```
# train periodically on historical 'normal' windows
model = IsolationForest(contamination=0.01)
model.fit(historical_feature_matrix)

# features: gas_price, block_time_variance, failed_tx_rate, pending_tx_delta
score = model.decision_function(current_feature_vector)
if score < anomaly_threshold:
    raise_alert('IsolationForestAnomaly', severity_from_score(score))
```

## 3) Combining Rules + ML
- Run rule-based checks first for low-latency deterministic alerts.
- Run behavior-based checks in parallel; if both fire, escalate severity.
- Add suppression/throttling to avoid alert storms (rate-limit alerts per-source).

## 4) Alert Structure
- id, timestamp, network, node, incident_type, severity, metrics_snapshot, hash
- signed/hashing for on-chain write operations

## 5) Example: End-to-End Evaluation Loop

```
while True:
    metrics = consume_latest_metrics()
    rule_alerts = evaluate_rules(metrics)
    z_alert, z_score = detect_zscore_anomaly(metrics.gas_price_series)
    ml_alert = run_isolation_forest_if_enabled(metrics.feature_vector)

    alerts = merge_and_prioritize(rule_alerts, z_alert, ml_alert)
    for a in alerts:
        emit_alert(a)
        if a.severity >= CRITICAL and config.write_onchain:
            tx_hash = write_incident_onchain(a)
            a.onchain_hash = tx_hash
    sleep(poll_interval)
```

## 6) Notes on Training & Drift
- Retrain ML models on rolling windows (daily/weekly) and validate using backtesting.
- Keep model explainability: record feature importances and representative anomalous windows for triage.
