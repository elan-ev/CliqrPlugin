# Configure the AMD module loader
requirejs.config

  # The path where your JavaScripts are located
  baseUrl: cliqr.config.ASSETS + 'js/',

  # Specify the paths of vendor libraries
  paths:
      # jquery:     'vendor/jquery-1.8.2',
      underscore: 'vendor/underscore-1.4.4'
      backbone:   'vendor/backbone-0.9.10'
      handlebars: 'vendor/handlebars-1.0.rc.2'

  # Underscore and Backbone are not AMD-capable per default,
  # so we need to use the AMD wrapping of RequireJS
  shim:
    underscore:
      exports: '_'
    backbone:
      deps: ['underscore']
      exports: 'Backbone'
    handlebars:
      exports: 'Handlebars'

  # For easier development, disable browser caching
  # Of course, this should be removed in a production environment
  # urlArgs: 'bust=' +  (new Date()).getTime()


# Bootstrap the application
require ['questions_app'], (QuestionsApp) ->
  app = new QuestionsApp()
  do app.initialize
