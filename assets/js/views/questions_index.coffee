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

    initialize: ->
      @listViews =
        'new':     new QuestionsListView(collection: @collection, state: 'new')
        'active':  new QuestionsListView(collection: @collection, state: 'active')
        'stopped': new QuestionsListView(collection: @collection, state: 'stopvis', sortable: true)

      # TODO Ob das so eine gute Idee ist?
      @listenTo Backbone, "page-after-show", @postRender

    remove: ->
      view.remove() for key, view of @listViews
      super()

    render: ->
      template = utils.compileTemplate 'questions-index'
      @$el.html template()

      for key, view of @listViews
        @$('#' + key + '-questions').replaceWith view.render().el
      @

    postRender: ->
      view.postRender() for key, view of @listViews
