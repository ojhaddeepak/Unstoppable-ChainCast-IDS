"""Minimal ChainCast-IDS demo script

Usage:
    python -m src.main --node NODE_NAME
"""
import argparse
import random
import time


def simulate_stability(node: str):
    # deterministic-ish demo: seed with node name length
    random.seed(len(node) + int(time.time()) // 60)
    score = round(random.uniform(0.0, 1.0), 3)
    if score < 0.3:
        status = "UNSTABLE"
    elif score < 0.6:
        status = "DEGRADED"
    else:
        status = "STABLE"
    return score, status


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--node", default="example", help="Node identifier (demo)")
    args = p.parse_args()

    score, status = simulate_stability(args.node)
    print(f"ChainCast-IDS demo — node={args.node}")
    print(f"stability_score={score} status={status}")
    if status != "STABLE":
        print("ALERT: potential instability detected — sample IDS signature matched")


if __name__ == "__main__":
    main()
