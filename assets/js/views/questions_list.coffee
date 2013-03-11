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
        @sortOptions = new SortOptionsView list: @


    remove: ->
      @sortOptions?.remove()
      super()


    render: ->
      filtered = @collection.where(state: @state)
      context =
        questions: _.invoke filtered, "toJSON"
      @$el.html(@template(context))

      @$el.addClass "state-#{@state}"

      if @sortOptions and filtered.length
        @$el.prepend @sortOptions.render().el
      @


    postRender: ->
      @sortOptions?.postRender()


    deleteQuestion: (event) ->
      event.preventDefault()

      if window.confirm "Wirklich l\xf6schen?"
        li = $(event.target).closest("li")
        id = li.data("id")
        li.fadeOut().promise().done =>
          @collection.get(id).destroy()
          li.remove()
          @postRender()
