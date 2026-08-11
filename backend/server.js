const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { checkConnection } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log('Starting Expense Tracker Server...');
  await checkConnection();

  app.listen(PORT, () => {
    console.log(`🚀 Expense Tracker Backend is running on http://localhost:${PORT}`);
    console.log(`📡 Health Check URL: http://localhost:${PORT}/api/health`);
  });
};

startServer();
