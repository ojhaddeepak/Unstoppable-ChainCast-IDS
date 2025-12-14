function forecastGas(gasHistory) {
  const avg =
    gasHistory.reduce((a, b) => a + b, 0) / gasHistory.length;

  if (avg > 80) return "High congestion expected";
  if (avg > 40) return "Moderate congestion expected";
  return "Network likely stable";
}

module.exports = forecastGas;
