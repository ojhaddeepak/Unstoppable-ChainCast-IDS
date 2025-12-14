const express = require("express");
const getMetrics = require("../services/blockchainMetrics");
const detectIntrusion = require("../services/idsEngine");
const { addAlert, getAlerts } = require("../services/alertManager");

const router = express.Router();

router.get("/metrics", async (req, res) => {
  try {
    const metrics = await getMetrics();
    const intrusion = detectIntrusion(metrics);

    if (intrusion) addAlert(intrusion);

    res.json({ metrics, intrusion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/alerts", (req, res) => {
  res.json(getAlerts());
});

module.exports = router;
