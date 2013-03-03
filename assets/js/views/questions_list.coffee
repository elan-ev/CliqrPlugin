define [
  'views/template_view'
  'views/questions_sort_options'
], (TemplateView, SortOptionsView) ->

  class QuestionsListView extends TemplateView
    template_id: 'questions-index-list'

    events:
      "click button.delete": "deleteQuestion"

    className: 'questions'


    initialize: (options) ->
      @state = options.state

      if options.sortable
        @sortOptions = new SortOptionsView list: @$el

      @listenTo @collection, "add remove", @onCollectionChange


    render: ->
      filtered = @collection.where(state: @state)
      context =
        questions: _.invoke filtered, "toJSON"
      @$el.html(@template(context))

      @$el.addClass "state-#{@state}"

      if @sortOptions and filtered.length
        @$el.prepend @sortOptions.render().el
      @


    deleteQuestion: (event) ->
      event.preventDefault()

      if window.confirm "Wirklich l\xf6schen?"
        id = $(event.target).closest("li").data("id")
        @collection.get(id).destroy()


    onCollectionChange: (model, collection) ->
      do @render  if @state is model.get "state"
