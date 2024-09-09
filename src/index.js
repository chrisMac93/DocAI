// Load environment variables from .env file
require('dotenv').config();

// Import init and scan commands from commands module
const { init, scan } = require('./commands');

// Export init and scan functions for external use
module.exports = {
  init,
  scan,
};