define [
  'backbone'
  'utils'
  'underscore'
  'views/questions_form'
  'views/questions_list'
  'views/questions_helpers'
], (Backbone, utils, _, QuestionsForm, QuestionsListView, _helpers) ->

  class QuestionsIndexView extends Backbone.View
    className: "page"

    events:
      "click button.delete":   "confirmDelete"
      "click a.questions-new": "showCreateForm"

    initialize: ->
      @listViews =
        'new':     new QuestionsListView(collection: @collection, state: 'new')
        'active':  new QuestionsListView(collection: @collection, state: 'active')
        'stopped': new QuestionsListView(collection: @collection, state: 'stopvis', sortable: true)

    render: ->
      template = utils.compileTemplate 'questions-index'
      @$el.html template()

      for key, view of @listViews
        @$('#' + key + '-questions').replaceWith view.render().el
      @

    confirmDelete: (event) ->
      unless window.confirm "Wirklich l\xf6schen?"
        event.preventDefault()

    showCreateForm: (event) ->
      event.preventDefault()
      form = new QuestionsForm()
      utils.changeToPage form
