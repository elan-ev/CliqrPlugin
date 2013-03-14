define [
  'backbone'
  'utils'
  'underscore'
  'views/questions_form'
  'views/questions_helpers'
], (Backbone, utils, _, QuestionsForm, QuestionsListView, _helpers) ->

  class QuestionsIndexView extends Backbone.View
    className: "page"

    initialize: ->
      @

    render: ->
      template = utils.compileTemplate 'questions-index'
      context =
        questions: @collection.toJSON()
      @$el.html template(context)
      @
      
    postRender: ->
      $("#questions-table").tablesorter();