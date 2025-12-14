let alerts = [];

function addAlert(alert) {
  alerts.push({ ...alert, time: new Date() });
}

function getAlerts() {
  return alerts;
}

module.exports = { addAlert, getAlerts };
