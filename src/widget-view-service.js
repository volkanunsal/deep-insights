var CategoryContentView = require('./widgets/category/content-view');
var FormulaContentView = require('./widgets/formula/content-view');
var HistogramContentView = require('./widgets/histogram/content-view');
var ListContentView = require('./widgets/list/content-view');
var WidgetViewFactory = require('./widgets/widget-view-factory');

var WidgetViewService = function () {
  return new WidgetViewFactory([
    {
      type: 'formula',
      createContentView: function (widgetModel) {
        return new FormulaContentView({
          model: widgetModel
        });
      }
    }, {
      type: 'list',
      createContentView: function (widgetModel) {
        return new ListContentView({
          model: widgetModel
        });
      }
    }, {
      type: 'histogram',
      createContentView: function (widgetModel) {
        return new HistogramContentView({
          model: widgetModel
        });
      }
    }, {
      type: 'category',
      createContentView: function (widgetModel) {
        return new CategoryContentView({
          model: widgetModel
        });
      }
    }
  ]);
};

module.exports = WidgetViewService;