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

    groupByDate: ->
      @groupBy (model) ->
        start = model.get("startdate")
        if start is 0 then null else 86400 * Math.floor start / 86400
