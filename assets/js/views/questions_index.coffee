define [
  'backbone'
  'utils'
  'views/questions_index'
  'views/questions_sort_options'
  'views/questions_form'
], (Backbone, utils, QuestionsIndexView, SortOptionsView, QuestionsForm) ->

  class QuestionsIndexView extends Backbone.View
    events:
      "click button.delete":   "confirmDelete"
      "click a.questions-new": "showCreateForm"

    initialize: ->
      @sortOptions = new SortOptionsView el: @$ "#stopped-questions"

    render: ->
      @

    confirmDelete: (event) ->
      unless window.confirm "Wirklich l\xf6schen?"
        event.preventDefault()

    showCreateForm: (event) ->
      event.preventDefault()
      form = new QuestionsForm()
      utils.changeToPage form
