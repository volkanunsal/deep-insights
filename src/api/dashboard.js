var URLHelper = require('./url-helper');
var _ = require('underscore');

function Dashboard (dashboard) {
  this._dashboard = dashboard;
}

Dashboard.prototype = {

  /**
   * @return {View} used in the dashboard
   */
  getView: function () {
    return this._dashboard.dashboardView;
  },

  /**
   * @return {Map} the map used in the dashboard
   */
  getMap: function () {
    return this._dashboard.vis;
  },

  /**
   * @return {Array} of widgets in the dashboard
   */
  getWidgets: function () {
    return this._dashboard.widgets.getList();
  },

  getDashboardURL: function () {
    return URLHelper.getURLFromState(this.getState());
  },

  getState: function () {
    var state = {};
    var mapState = this.getMapState(); // TODO
    if (!_.isEmpty(mapState)) state.map = mapState;
    /*
     * TODO: Disabled widget states until issues are fixed.
     * See https://github.com/CartoDB/deep-insights.js/issues/416
     */
    // var widgetsState = this._dashboard.widgets._widgetsCollection.getStates();
    // if (!_.isEmpty(widgetsState)) state.widgets = widgetsState;
    return state;
  },

  getMapState: function () {
    var initialState = this._dashboard.dashboardView.getInitialMapState();
    var currentCenter = this._dashboard.vis.map.get('center');
    var currentZoom = this._dashboard.vis.map.getZoom();
    var upperLat = initialState.center[0] * 0.01;
    var upperLon = initialState.center[1] * 0.01;
    var inside = (Math.abs(initialState.center[0] - currentCenter[0]) < upperLat) && (Math.abs(initialState.center[1] - currentCenter[1]) < upperLon);
    if (inside && _.isEqual(currentZoom, initialState.zoom)) {
      return {};
    } else {
      return {
        center: currentCenter,
        zoom: currentZoom
      };
    }
  },

  setState: function (state) {
    // todo: set map state
    this._dashboard.widgets.setWidgetsState(state.widgets);
    this._dashboard.vis.map.setView(state.map.center, state.map.zoom);
  },

  onStateChanged: function (callback) {
    /*
     * TODO: Disabled widget states until issues are fixed.
     * See https://github.com/CartoDB/deep-insights.js/issues/416
     */
    // this._dashboard.widgets._widgetsCollection.bind('change', function () {
    //   callback(this.getState(), this.getDashboardURL());
    // }, this);

    this._dashboard.vis.map.bind('change', function () {
      callback(this.getState(), this.getDashboardURL());
    }, this);
  },

  /**
   * @param {Integer} id - widget id
   * @return a widget object
   */
  getWidget: function (id) {
    return this._dashboard.widgets.get(id);
  },

  /**
   * Create a category widget.
   * @param {Object} widgetAttrs - attributes for the new widget
   * @param {string} widgetAttrs.id - id (required)
   * @param {string} widgetAttrs.title - title (required)
   * @param {number} widgetAttrs.order - index of the widget (optional)
   * @param ...
   * @return {CategoryWidget} The new widget
   */
  createCategoryWidget: function (widgetAttrs, layer, state) {
    return this._dashboard.widgets.createCategoryModel(widgetAttrs, layer, state);
  },

  /**
   * Create a histogram widget
   * @param {Object} widgetAttrs - attributes for the new widget
   * @param {string} widgetAttrs.id - id (required)
   * @param {string} widgetAttrs.title - title (required)
   * @param {number} widgetAttrs.order - index of the widget (optional)
   * @param ...
   * @return {HistogramWidget} The new widget
   */
  createHistogramWidget: function (widgetAttrs, layer, state) {
    return this._dashboard.widgets.createHistogramModel(widgetAttrs, layer, state);
  },

  /**
   * Create a formula widget
   * @param {Object} widgetAttrs - attributes for the new widget
   * @param {string} widgetAttrs.id - id (required)
   * @param {string} widgetAttrs.title - title (required)
   * @param {number} widgetAttrs.order - index of the widget (optional)
   * @param ...
   * @return {FormulaWidget} The new widget
   */
  createFormulaWidget: function (widgetAttrs, layer, state) {
    return this._dashboard.widgets.createFormulaModel(widgetAttrs, layer, state);
  },

  /**
   * Create a timesier es widget
   * @param {Object} widgetAttrs - attributes for the new widget
   * @param {string} widgetAttrs.id - id (required)
   * @param {string} widgetAttrs.title - title (required)
   * @param {number} widgetAttrs.order - index of the widget (optional)
   * @param ...
   * @return {TimeSeriesWidget} The new widget
   */
  createTimeSeriesWidget: function (widgetAttrs, layer, state) {
    return this._dashboard.widgets.createTimeSeriesModel(widgetAttrs, layer, state);
  }

};

module.exports = Dashboard;
