var _ = require('underscore');
var cdb = require('cartodb.js');
var Dashboard = require('./dashboard');
var DashboardView = require('../dashboard-view');
var WidgetsCollection = require('../widgets/widgets-collection');
var WidgetsService = require('../widgets-service');
var URLHelper = require('./url-helper');

/**
 * Translates a vizJSON v3 datastructure into a working dashboard which will be rendered in given selector.
 *
 * @param {String} selector e.g. "#foobar-id", ".some-class"
 * @param {Object} vizJSON JSON datastructure
 * @param {Object} opts (Optional) flags, see 3rd param for cdb.createVis for available ones. Keys used here:
 *   renderMenu: {Boolean} If true (default), render a top-level menu on the left side.
 * @return {Object} with keys:
 *   dashboardView: root (backbone) view of the dashboard
 *   vis: the instantiated vis map, same result as given from cdb.createVis()
 */
var createDashboard = function (selector, vizJSON, opts, callback) {
  var dashboardEl = document.querySelector(selector);
  if (!dashboardEl) throw new Error('no element found with selector ' + selector);

  // Default options
  opts = opts || {};
  opts.renderMenu = _.isBoolean(opts.renderMenu)
    ? opts.renderMenu
    : true;

  var widgets = new WidgetsCollection();
  var coords = JSON.parse(vizJSON.center);

  var model = new cdb.core.Model({
    title: vizJSON.title,
    description: vizJSON.description,
    updatedAt: vizJSON.updated_at,
    userName: vizJSON.user.fullname,
    userProfileURL: vizJSON.user.profile_url,
    userAvatarURL: vizJSON.user.avatar_url,
    renderMenu: opts.renderMenu,
    initialPosition: {
      center: coords,
      zoom: vizJSON.zoom
    }
  });
  var dashboardView = new DashboardView({
    el: dashboardEl,
    widgets: widgets,
    model: model
  });
  var stateFromURL = opts.state || URLHelper.getStateFromCurrentURL();
  if (!_.isEmpty(stateFromURL.map)) {
    vizJSON.center = stateFromURL.map.center;
    vizJSON.bounds = null;
    vizJSON.zoom = stateFromURL.map.zoom;
  }

  var vis = cdb.createVis(dashboardView.$('#map'), vizJSON, _.extend(opts, {
    skipMapInstantiation: true
  }));
  
  vis.once('load', function (vis) {
    if (!_.isEmpty(stateFromURL.map)) {
      vis.map.setView(stateFromURL.map.center, stateFromURL.map.zoom);
    }

    var widgetsState = stateFromURL.widgets || {};

    // Create widgets
    var widgetsService = new WidgetsService(widgets, vis.dataviews);
    var widgetModelsMap = {
      list: widgetsService.createListModel.bind(widgetsService),
      formula: widgetsService.createFormulaModel.bind(widgetsService),
      histogram: widgetsService.createHistogramModel.bind(widgetsService),
      'time-series': widgetsService.createTimeSeriesModel.bind(widgetsService),
      category: widgetsService.createCategoryModel.bind(widgetsService)
    };
    vizJSON.widgets.forEach(function (d) {
      // Flatten the data structure given in vizJSON, the widgetsService will use whatever it needs and ignore the rest
      var attrs = _.extend({}, d, d.options);
      var newWidgetModel = widgetModelsMap[d.type];
      var state = widgetsState[d.id];

      if (_.isFunction(newWidgetModel)) {
        // Find the Layer that the Widget should be created for.
        var layer;
        if (d.layer_id) {
          layer = vis.map.layers.get(d.layer_id);
        } else if (Number.isInteger(d.layerIndex)) {
          // TODO Since namedmap doesn't have ids we need to map in another way, here using index
          //   should we solve this in another way?
          layer = vis.map.layers.at(d.layerIndex);
        }

        newWidgetModel(attrs, layer, state);
      } else {
        cdb.log.error('No widget found for type ' + d.type);
      }
    });

    dashboardView.render();

    if (widgets.size() > 0) {
      vis.centerMapToOrigin();
    }

    vis.instantiateMap({
      success: function () {
        callback && callback(null, {
          dashboardView: dashboardView,
          widgets: widgetsService,
          vis: vis
        });
      },
      error: function () {
        var error = new Error('Map instantiation failed');
        console.log(error);
        callback && callback(error, {
          dashboardView: dashboardView,
          widgets: widgetsService,
          vis: vis
        });
      }
    });
  });
};

module.exports = function (selector, vizJSON, opts, callback) {
  var args = arguments;
  var fn = args[args.length - 1];

  if (_.isFunction(fn)) {
    callback = fn;
  }

  function _load (vizJSON) {
    createDashboard(selector, vizJSON, opts, function (error, dashboard) {
      var dash = new Dashboard(dashboard);
      if (opts.share_urls) {
        dash.onStateChanged(_.debounce(function (state, url) {
          window.history.replaceState('Object', 'Title', url);
        }, 500));
      }

      callback && callback(error, dash);
    });
  }

  if (typeof vizJSON === 'string') {
    cdb.core.Loader.get(vizJSON, function (data) {
      if (data) {
        _load(data, opts);
      } else {
        callback && callback(new Error('error fetching viz.json file'));
      }
    });
  } else {
    _load(vizJSON, opts);
  }
};
