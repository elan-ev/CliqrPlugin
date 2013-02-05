# Configure the AMD module loader
requirejs.config

  # The path where your JavaScripts are located
  baseUrl: cliqr.config.ASSETS + 'js/',

  # Specify the paths of vendor libraries
  paths:
      # jquery:     'vendor/jquery-1.8.2',
      underscore: 'vendor/underscore-1.4.2'
      backbone:   'vendor/backbone-0.9.2'
      mustache:   'vendor/mustache'

  # Underscore and Backbone are not AMD-capable per default,
  # so we need to use the AMD wrapping of RequireJS
  shim:
    underscore:
      exports: '_'
    backbone:
      deps: ['underscore']
      exports: 'Backbone'

  # For easier development, disable browser caching
  # Of course, this should be removed in a production environment
  # urlArgs: 'bust=' +  (new Date()).getTime()


# Bootstrap the application
require ['questions_app'], (QuestionsApp) ->
  app = new QuestionsApp()
  do app.initialize
