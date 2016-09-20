var cdb = require('cartodb.js');

cdb.deepInsights = {
  VERSION: require('../package.json').version,
  createDashboard: require('./api/create-dashboard'),
  Ps: require('perfect-scrollbar'),
  WidgetViewService: require('./widget-view-service'),
  AnimateValues: require('./widgets/animate-values.js')
};
module.exports = cdb;
