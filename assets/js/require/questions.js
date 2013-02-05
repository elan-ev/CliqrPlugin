(function() {

  requirejs.config({
    baseUrl: cliqr.config.ASSETS + 'js/',
    paths: {
      underscore: 'vendor/underscore-1.4.2',
      backbone: 'vendor/backbone-0.9.2',
      mustache: 'vendor/mustache'
    },
    shim: {
      underscore: {
        exports: '_'
      },
      backbone: {
        deps: ['underscore'],
        exports: 'Backbone'
      }
    }
  });

  require(['questions_app'], function(QuestionsApp) {
    var app;
    app = new QuestionsApp();
    return app.initialize();
  });

}).call(this);
