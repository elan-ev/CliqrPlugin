class cliqr.model.Question extends Backbone.Model

  initialize: ->
    console.log "initialized a Question model", arguments

  url: ->
    cliqr.config.PLUGIN_URL + "questions/show/#{@get 'id'}?cid=" + cliqr.config.CID

# TODO reuse in polls.coffee
nominal =
  do (A = "A".charCodeAt 0) ->
    (index) ->
      String.fromCharCode A + index % 26


###
We use Mustache as template engine. This function makes it a lot
easier to get a pre-compiled Mustache template.
###
compileTemplate = _.memoize (name) ->
  Mustache.compile $("#cliqr-template-#{name}").html()

class cliqr.ui.TemplateView extends Backbone.View
  template: ->
    @template = compileTemplate @template_id
    @template.apply @, arguments



class cliqr.ui.QuestionsIndexView extends Backbone.View
  el: '#cliqr-index'

  events:
    "click button.delete":   "confirmDelete"
    #"click a.questions-new": "fsshow"
    #"click a.questions-new": "showCreateForm"

  confirmDelete: (event) ->
    unless window.confirm "Wirklich l\xf6schen?"
      event.preventDefault()

  showCreateForm: (event) ->
    event.preventDefault()
    form = new cliqr.ui.QuestionForm()
    @$('.page').html form.render().el


class cliqr.ui.QuestionView extends Backbone.View

  el: '#cliqr-show'

  events:
    "click .fullscreen": "showFS"
    "click .appeal.start a":   "startQuestion"

  showFS: ->
    container = @$("#layout_page")[0]
    if container.requestFullscreen
      container.requestFullscreen()
    else if container.mozRequestFullScreen
      container.mozRequestFullScreen()
    else if container.webkitRequestFullscreen
      container.webkitRequestFullscreen()
    false


  initialize: ->
    console.log "initialized a QuestionView", @
    @model.on "change:answers", @updateAnswers

  render: ->
    @enhanceChart()
    @

  enhanceChart: ->
    @$('.chart').remove()

    width   = 300
    answers = @$ ".results .count"
    data    = _.pluck @model.get("answers"), "counter"
    max     = _.max data
    widths  = _.map data, (d) -> if max > 0 then d / max * width else 0

    console.log "enhance charts", data

    answers.after (index) ->
      $('<span class="chart"></div>').css(width: widths[index]).attr("data-count": data[index])

  updateAnswers: (model, answers, options) =>

    attrs =
      answers: (_.extend {}, e, nominal: nominal i for e, i in answers)

    console.log attrs

    template = compileTemplate "questions-results"
    @$(".results").replaceWith template attrs
    @render()

  startQuestion: (event) ->
    @$(".appeal.start").addClass("busy")

addNewChoice = (event) ->
  new_choice = $(event.target).closest(".choices").find(".choice-new")
  template = compileTemplate 'questions-choice'
  empty_question = answer_id: '', text: ''
  $(template empty_question).insertBefore(new_choice).find("input").focus()


class cliqr.ui.QuestionForm extends cliqr.ui.TemplateView

  template_id: 'questions-form'

  events:
    "click .choice-new":    "addChoice"
    "click .close":         "removeChoice"
    "keydown input.choice": "enhanceChoiceInput"
    "submit form":          "submitForm"

  render: ->
    Mustache.compilePartial 'choice', $("#cliqr-template-questions-choice").html()

    @$el.html @template if @model then @model.toJSON() else {}
    @$("form").validator()
    @

  addChoice: (event) ->
    addNewChoice(event)

  removeChoice: (event) ->
    choice_input = $(event.target).closest(".choice-input")
    if choice_input.siblings(".choice-input").length
      choice_input.remove()
    else
      choice_input.effect "shake", 50

  enhanceChoiceInput: (event) ->
      if event.which == 13 \    # enter
         or event.which == 38 \ # arrow_up
         or event.which == 40 \ # arrow_down
         or event.which == 9 and !event.shiftKey # tab

        inputs = @$ ".choices input"
        last   = inputs.length - 1
        index  = inputs.index(event.target)

        # tabs
        if event.which is 9 and last is index
          event.preventDefault()
          addNewChoice event

        # enter or arrow_down
        if event.which is 13 or event.which is 40

          if last is index
            addNewChoice event
          else
            inputs[index + 1].focus()
          event.preventDefault()

        # arrow_up
        if event.which is 38
          form_inputs = @$(".choices input")
          index = Math.max 0, form_inputs.index(event.target) - 1
          form_inputs.eq(index).focus()
          event.preventDefault()


  submitForm: (event) ->
      event.preventDefault()

      url_re = /^(.*cliqrplugin\/questions).*cid=([a-fA-F0-9]{32})/
      [everything, url, cid] = document.location.href.match(url_re)

      alert \
        if @model
          "#{url}/update/#{@model.id}?cid=#{cid}"
        else
          "#{url}/create?cid=#{cid}"

      return

      form = @$ "form"
      if form.data("validator").checkValidity()
        url = form.attr("action")
        $.post(url, form.serialize())
          .done (msg) ->
            re = /(?!questions\/)(create|update\/[a-fA-F0-9]{32})/
            # document.location = url.replace re, "show/#{msg.id}"
            alert url.replace re, "show/#{msg.id}"

          .fail () ->
            console.log "fail", arguments
