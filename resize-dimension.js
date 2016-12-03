(function (root, factory) {
  var moduleName = 'ResizeDimension';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], function ($) {
        return (root[moduleName] = factory($));
    });
  } else {
    root[moduleName] = factory(root.$);
  }
}(this, function ($) {

  var $window = $(window);

  var ResizeDimension = function ($el, dimension, handler, options) {

    if (! (this instanceof ResizeDimension)) {
      return new ResizeDimension($el, dimension, handler, options);
    }

    this.$el = $el;

    this.init(dimension, handler, options);

    return this;
  };

  /**
   * Stub - overridden on #init()
   */
  ResizeDimension.prototype.onResize = function () {};

  ResizeDimension.bound = {};

  ResizeDimension.bind = function (dimension, options) {
    if (ResizeDimension.bound[dimension]) return;
    ResizeDimension.bound[dimension] = true;
    $window.resizeDimension(dimension, function () {
      $window.trigger('resize-' + dimension);
    }, options);
  };

  ResizeDimension.prototype.init = function (dimension, handler, options) {

    if (typeof dimension === 'object') {
      options = dimension;
      dimension = options.dimension;
      handler = options.handler;
    }

    options = $.extend({}, options);
    options.dimension = dimension;
    options.handler = handler;

    this.options = options;

    if ($.isFunction(options.changed)) {
      this.changed = options.changed;
    }

    this.dimension = this.normalize(options.dimension);
    this.handler = options.handler;
    this.previousValue = this.value();

    var proxied = $.proxy(this.handle, this);
    if (options.throttler) {
      this.onResize = options.throttler(proxied);
    }
    else {
      this.onResize = proxied;
    }
  };

  ResizeDimension.prototype.normalize = function (dimension) {
    return dimension;
  };
  ResizeDimension.prototype.changed = function (previous, current) {
    return previous !== current;
  };

  ResizeDimension.prototype.value = function (e) {
    return this.$el[this.dimension]();
  };

  ResizeDimension.prototype.handle = function (e) {
    var currentValue = this.value();
    if (this.changed(this.previousValue, currentValue)) {
      this.previousValue = currentValue;
      return this.handler.call(this.$el, e);
    }
  };

  var $resizeDimension = function () {
    var args = Array.prototype.slice.call(arguments);
    return this.each( function() {
      var $el = $(this);
      args = [$el].concat(args);
      var instance = ResizeDimension.apply(null, args);
      $el.on('resize', $.proxy(instance.onResize, instance));
    });
  };

  $.fn.resizeDimension = $resizeDimension;

  return ResizeDimension;

}));