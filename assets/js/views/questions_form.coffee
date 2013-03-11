define [
  'backbone'
  'utils'
  'handlebars'
  'views/template_view'
], (Backbone, utils, Handlebars, TemplateView) ->

  class QuestionsForm extends TemplateView
    template_id: 'questions-form'
    className:   'questions-form'

    events:
      "click .choice-new":    "addChoice"
      "click .close":         "removeChoice"
      "keydown input.choice": "enhanceChoiceInput"
      "submit form":          "submitForm"

    initialize: ->
      unless Handlebars.partials['choice']
        Handlebars.registerPartial 'choice', utils.compileTemplate 'questions-choice'

    render: ->
      @$el.html @template if @model then @model.toJSON() else {}
      @$("form").validator()
      @

    addChoice: (event) ->
      choice = Handlebars.partials['choice'] {}
      $(choice).insertBefore(@$ '.choice-new').find("input").focus()

    removeChoice: (event) ->
      choice_input = $(event.target).closest(".choice-input")
      if choice_input.siblings(".choice-input").length
        choice_input.remove()
      else
        choice_input.effect "shake", 50

    enhanceChoiceInput: (event) ->
        if    event.which == 13 \ # enter
           or event.which == 38 \ # arrow_up
           or event.which == 40   # arrow_down

          inputs = @$ ".choices input"
          last   = inputs.length - 1
          index  = inputs.index(event.target)

          # enter or arrow_down
          if event.which is 13 or event.which is 40

            if last is index
              @addChoice()
            else
              inputs[index + 1].focus()

            event.preventDefault()

          # arrow_up
          if event.which is 38
            form_inputs = @$(".choices input")
            index = Math.max 0, form_inputs.index(event.target) - 1
            form_inputs.eq(index).focus()
            event.preventDefault()

    disableSaveButton = ->
      button = @$ "button[name=save]"
      button.prop("disabled", true).showAjaxNotification() if button.length

    # TODO
    submitForm: (event) ->
        event.preventDefault()
        form = @$ "form"

        return unless form.data("validator").checkValidity()

        disableSaveButton()

        action = "questions/" + if @model then "update/#{@model.id}" else "create"
        url = "#{cliqr.config.PLUGIN_URL}#{action}?cid=#{cliqr.config.CID}"

        $.post(url, form.serialize())
          .done (msg) ->
            Backbone.history.navigate "show-#{msg.id}", trigger: true
          .fail () ->
            console.log "TODO fail", arguments
