const provider = require("../config/rpc");

async function getMetrics() {
  const block = await provider.getBlock("latest");
  const gasPrice = await provider.getGasPrice();

  return {
    blockNumber: block.number,
    blockTime: block.timestamp,
    gasPrice: Number(gasPrice) / 1e9
  };
}

module.exports = getMetrics;
