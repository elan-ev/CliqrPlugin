define [
  'backbone'
  'utils'
  'models/questions'
  'views/questions_index'
], (Backbone, utils, QuestionCollection, QuestionsIndexView) ->

  class QuestionsRouter extends Backbone.Router

    routes:
      "": "index"

    index: ->
      questions = new QuestionCollection cliqr.config.POLLS
      utils.changeToPage new QuestionsIndexView collection: questions
