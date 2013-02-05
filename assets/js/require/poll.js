(function() {

  requirejs.config({
    baseUrl: cliqr.config.ASSETS + 'js/',
    paths: {
      jquery: 'vendor/jquery-1.8.2',
      underscore: 'vendor/underscore-1.4.2',
      backbone: 'vendor/backbone-0.9.2',
      mustache: 'vendor/mustache',
      jqm: 'vendor/jquery.mobile-1.2.0.min'
    },
    shim: {
      underscore: {
        exports: '_'
      },
      backbone: {
        deps: ['underscore'],
        exports: 'Backbone'
      },
      jqm: {
        deps: ['jquery', 'jqm_config'],
        exports: 'jquery.mobile'
      }
    }
  });

  require(['poll_app'], function(PollApp) {
    var app;
    app = new PollApp();
    return app.initialize();
  });

}).call(this);
