function calculateScore(gas, failedTxRate) {
  let score = 100;
  score -= gas > 80 ? 20 : gas > 40 ? 10 : 0;
  score -= failedTxRate * 30;
  return Math.max(score, 0);
}

module.exports = calculateScore;
