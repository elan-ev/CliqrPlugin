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
      @initPseudoRouter()

      do Backbone.history.start


    # TODO clean this up!
    initStuff: ->
      # destroy self-destroy messages
      setTimeout (-> $(".self-destroy").remove()), 5000


    initRouters: ->
      router = new QuestionsRouter


    initPseudoRouter: ->

      # Route: questions/show
      if $('#cliqr-show').length
        # prepare model
        model = new Question cliqr.model.$currentQuestion
        # TODO gehört hier nicht hin
        setInterval (-> do model.fetch), 2000

        utils.changeToPage new QuestionView
          el: $ '#cliqr-show .page'
          model: model
