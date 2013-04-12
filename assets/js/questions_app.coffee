define [
  'backbone'
  'routers/questions'
  'views/questions_helpers'
], (Backbone, QuestionsRouter, _helpers) ->

  # The application object
  # Choose a meaningful name for your application
  class QuestionsApp

    initialize: ->
      @initStuff()
      @initRouters()

      do Backbone.history.start


    # TODO clean this up!
    initStuff: ->
      # destroy self-destroy messages
      setTimeout (-> jQuery(".self-destroy").remove()), 5000


    initRouters: ->
      router = new QuestionsRouter
