define [
  'utils'
  'models/question'
  'models/questions'
  'views/questions_index'
  'views/questions_show'
  'routers/questions'
], (utils, Question, QuestionCollection, QuestionsIndexView, QuestionView, QuestionsRouter) ->

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
      setTimeout (-> $(".self-destroy").remove()), 5000


    initRouters: ->
      router = new QuestionsRouter
