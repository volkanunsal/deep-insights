module.exports = {
  VERSION: require('../package.json').version,
  createDashboard: require('./api/create-dashboard'),
  Ps: require('perfect-scrollbar')
};
