define [
  'backbone'
  'models/question'
], (Backbone, Question) ->

  ###
  TODO: docs
  ###
  class QuestionCollection extends Backbone.Collection
    model: Question

    # TODO this is wrong; works only for reading!
    url: ->
      cliqr.config.PLUGIN_URL + "questions/index?cid=" + cliqr.config.CID

    comparator: (question) ->
      question.get 'startdate'
