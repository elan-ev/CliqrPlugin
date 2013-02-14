define [
  'backbone'
  'utils'
  'models/questions'
  'views/questions_index'
  'views/questions_form'
], (Backbone, utils, QuestionCollection, QuestionsIndexView, QuestionsForm) ->

  class QuestionsRouter extends Backbone.Router

    routes:
      "": "index"
      "new": "newQuestion"

    index: ->
      questions = new QuestionCollection cliqr.config.POLLS
      utils.changeToPage new QuestionsIndexView collection: questions

    newQuestion: ->
      utils.changeToPage new QuestionsForm
