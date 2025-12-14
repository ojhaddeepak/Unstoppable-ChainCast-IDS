"""Simple collector simulator that POSTs demo metrics to the backend every few seconds."""
import requests
import time
import random

ENDPOINT = "http://127.0.0.1:8000/metrics"

def make_sample(node_name: str = "demo"):
    return {
        "network": node_name,
        "gas_price": round(random.uniform(10, 200), 2),
        "block_time": round(random.uniform(1, 15), 2),
        "tx_volume": random.randint(10, 5000),
        "pending_tx": random.randint(0, 2000),
        "failed_tx_rate": round(random.uniform(0.0, 0.4), 3)
    }

if __name__ == "__main__":
    print("Collector simulator started, sending samples to", ENDPOINT)
    while True:
        s = make_sample()
        try:
            r = requests.post(ENDPOINT, json=s, timeout=3)
            print("sent", s, "->", r.status_code)
        except Exception as e:
            print("error sending sample:", e)
        time.sleep(2)
