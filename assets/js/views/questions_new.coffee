define [
  'views/template_view'
  'views/questions_form'
], (TemplateView, QuestionsForm) ->

  class QuestionsNewView extends TemplateView
    template_id: 'questions-new'

    className: "page"

    initialize: ->
      @form = new QuestionsForm

    render: ->
      @$el.html @template()
      @$el.append @form.render().el
      @

    postRender: ->
      @form.postRender()

    remove: ->
      @form.remove()
      super()
