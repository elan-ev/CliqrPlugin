define [
  'views/template_view'
  'views/questions_sort_options'
], (TemplateView, SortOptionsView) ->

  class QuestionsListView extends TemplateView
    template_id: 'questions-index-list'

    className: 'questions'

    initialize: (options) ->
      @state = options.state

      if options.sortable
        @sortOptions = new SortOptionsView list: @$el

    render: ->
      filtered = @collection.where(state: @state)
      context =
        questions: _.invoke filtered, "toJSON"
      @$el.html(@template(context))

      @$el.addClass "state-#{@state}"

      if @sortOptions and filtered.length
        @$el.prepend @sortOptions.render().el

      @
