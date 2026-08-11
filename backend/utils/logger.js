/**
 * Utility logger placeholder
 */
const logInfo = (message) => {
  console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
};

module.exports = { logInfo };
