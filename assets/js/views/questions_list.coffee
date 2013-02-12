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
      context =
        questions: _.invoke @collection.where(state: @state), "toJSON"
      @$el.html(@template(context))

      @$el.addClass "state-#{@state}"

      if @sortOptions
        @$el.prepend @sortOptions.render().el

      @
