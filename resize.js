(function () {
  var $window = $(window);

  /**
   * Event use
   */
  ResizeDimension.bind('width');

  $window.on('resize-width', function () {
    console.log('resize-width event');
  });

  /*
   * Simple use.
   */

  $window.resizeDimension('width', function () {
    console.log('width simple');
  });

  $window.resizeDimension('height', function () {
    console.log('height simple');
  });

  /*
   * With some options.
   */

  $window.resizeDimension('width', function () {
    console.log('width options');
  }, {
    throttler: function (f) {
      console.log('throttling width options handler');
      // fake wrapping in throttling function...
      return function () {
        console.log('throttled...');
        f();
      }
    }
  });

  $window.resizeDimension({
    dimension: 'height',
    handler: function () {
      console.log('height options - changed > 50px');
    },
    throttler: function (f) { return f; },
    changed: function (current, previous) {
      return Math.abs(current - previous) > 50;
    }
  });

  /*
   * Raw API.
   */

  $window.on('resize', ResizeDimension($window, 'width', function () {
    console.log('width raw');
  }).onResize);

  $window.on('resize', ResizeDimension($window, 'height', function () {
    console.log('height raw');
  }).onResize);

})();