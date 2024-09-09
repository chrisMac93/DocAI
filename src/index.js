require('dotenv').config();

const { init, scan } = require('./commands');

module.exports = {
  init,
  scan,
};