from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
import time
from typing import List, Dict

app = FastAPI(title="ChainCast-IDS Backend")

# In-memory stores for demo
METRICS: List[Dict] = []
ALERTS: List[Dict] = []
WS_CONNECTIONS: List[WebSocket] = []

class Metric(BaseModel):
    network: str
    gas_price: float
    block_time: float
    tx_volume: int
    pending_tx: int
    failed_tx_rate: float

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/metrics")
def post_metrics(metric: Metric):
    ts = int(time.time())
    record = {"ts": ts, **metric.dict()}
    METRICS.append(record)

    # Simple deterministic rule: gas spike vs previous sample
    if len(METRICS) > 1:
        prev = METRICS[-2]
        try:
            if metric.gas_price > 3 * max(prev.get("gas_price", metric.gas_price), 1e-9):
                alert = {"id": len(ALERTS) + 1, "type": "Gas Spike", "severity": "High", "ts": ts, "sample": record}
                ALERTS.append(alert)
                broadcast_alert(alert)
        except Exception:
            pass

    # Broadcast metric to websocket clients
    broadcast_metric(record)
    return {"received": True}

@app.get("/stability_score")
def stability_score():
    if not METRICS:
        return {"score": 100}
    last = METRICS[-1]
    # simple heuristic score (0-100)
    score = int(max(0, min(100, (1.0 - last.get("failed_tx_rate", 0)) * 100 - (last.get("pending_tx", 0) / 1000))))
    return {"score": score}

@app.get("/alerts")
def get_alerts():
    return ALERTS

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    WS_CONNECTIONS.append(ws)
    try:
        while True:
            await ws.receive_text()  # keep connection open; clients may ping
    except WebSocketDisconnect:
        WS_CONNECTIONS.remove(ws)

# Helper broadcast functions

def broadcast_alert(alert: Dict):
    for ws in list(WS_CONNECTIONS):
        try:
            import asyncio
            asyncio.create_task(ws.send_json({"type": "alert", "payload": alert}))
        except Exception:
            pass

def broadcast_metric(metric: Dict):
    for ws in list(WS_CONNECTIONS):
        try:
            import asyncio
            asyncio.create_task(ws.send_json({"type": "metric", "payload": metric}))
        except Exception:
            pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.backend.main:app", host="127.0.0.1", port=8000, reload=True)
