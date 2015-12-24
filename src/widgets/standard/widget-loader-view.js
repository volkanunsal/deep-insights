var cdb = require('cartodb.js');

/**
 *  Default widget loader view:
 *
 *  It will listen or not to dataModel changes when
 *  first load is done.
 */
module.exports = cdb.core.View.extend({
  className: 'CDB-Loader',

  initialize: function () {
    this._initBinds();
  },

  _initBinds: function () {
    this.model.bind('loading', this.show, this);
    this.model.bind('sync error', this.hide, this);
  },

  show: function () {
    this.$el.addClass('is-visible');
  },

  hide: function () {
    var self = this;
    setTimeout(function () {
      self.$el.removeClass('is-visible');
    }, 500);
  }

});