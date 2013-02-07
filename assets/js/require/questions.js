(function() {

  requirejs.config({
    baseUrl: cliqr.config.ASSETS + 'js/',
    paths: {
      underscore: 'vendor/underscore-1.4.2',
      backbone: 'vendor/backbone-0.9.2',
      handlebars: 'vendor/handlebars-1.0.rc.1'
    },
    shim: {
      underscore: {
        exports: '_'
      },
      backbone: {
        deps: ['underscore'],
        exports: 'Backbone'
      },
      handlebars: {
        exports: 'Handlebars'
      }
    }
  });

  require(['questions_app'], function(QuestionsApp) {
    var app;
    app = new QuestionsApp();
    return app.initialize();
  });

}).call(this);
