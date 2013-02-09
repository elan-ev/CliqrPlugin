define [
  'backbone'
  'models/question'
], (Backbone, Question) ->

  ###
  TODO: docs
  ###
  class QuestionCollection extends Backbone.Collection
    model: Question

    comparator: (question) ->
      question.get 'startdate'
