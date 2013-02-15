define [
  'views/template_view'
  'views/questions_form'
], (TemplateView, QuestionsForm) ->

  class QuestionsEditView extends TemplateView
    template_id: 'questions-edit'

    className: "page"

    initialize: ->
      @form = new QuestionsForm model: @model

    render: ->
      @$el.html @template()
      @$el.append @form.render().el
      @
