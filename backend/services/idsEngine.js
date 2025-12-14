function detectIntrusion(metrics) {
  if (metrics.gasPrice > 100) {
    return {
      type: "Gas Spike Attack",
      severity: "HIGH"
    };
  }
  return null;
}

module.exports = detectIntrusion;
