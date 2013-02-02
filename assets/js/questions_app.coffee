define [
  'backbone'
  'utils'
  'models/question'
  'views/questions_index'
  'views/questions_show'
], (Backbone, utils, Question, QuestionsIndexView, QuestionView) ->

  # The application object
  # Choose a meaningful name for your application
  class QuestionsApp

    initialize: ->
      @initStuff()
      @initPseudoRouter()


    # TODO clean this up!
    initStuff: ->
      # destroy self-destroy messages
      setTimeout (-> $(".self-destroy").remove()), 5000


    initPseudoRouter: ->

      # Route: questions/index
      if $('#cliqr-index').length
        utils.changeToPage new QuestionsIndexView el: $ '#cliqr-index .page'

      # Route: questions/show
      if $('#cliqr-show').length
        # prepare model
        model = new Question cliqr.model.$currentQuestion
        # TODO gehört hier nicht hin
        setInterval (-> do model.fetch), 2000

        utils.changeToPage new QuestionView
          el: $ '#cliqr-show .page'
          model: model
