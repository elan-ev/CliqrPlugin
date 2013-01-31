# This file is used by the question/* views.

# Model representing a Question
class cliqr.model.Question extends Backbone.Model
  url: ->
    cliqr.config.PLUGIN_URL + "questions/show/#{@get 'id'}?cid=" + cliqr.config.CID


# TODO reuse in polls.coffee
# returns the nth uppercase roman literal
nominal =
  do (A = "A".charCodeAt 0) ->
    (index) ->
      String.fromCharCode A + index % 26


# We use Mustache as template engine. This function makes it a lot
# easier to get a pre-compiled Mustache template.
compileTemplate = _.memoize (name) ->
  Mustache.compile $("#cliqr-template-#{name}").html()


# Extend this class to have access to the specified template
# which is lazily retrieved on first access
class cliqr.ui.TemplateView extends Backbone.View
  template: ->
    @template = compileTemplate @template_id
    @template.apply @, arguments


# TODO docs
class cliqr.ui.QuestionsIndexView extends Backbone.View
  el: '#cliqr-index'

  events:
    "click button.delete":   "confirmDelete"
    "click a.questions-new": "showCreateForm"

  initialize: ->
    @sortOptions = new cliqr.ui.SortOptionsView el: @$ "#stopped-questions"

  confirmDelete: (event) ->
    unless window.confirm "Wirklich l\xf6schen?"
      event.preventDefault()

  showCreateForm: (event) ->
    event.preventDefault()
    form = new cliqr.ui.QuestionForm()
    @$('.page').html form.render().el


# TODO docs
class cliqr.ui.SortOptionsView extends Backbone.View
  initialize: ->
    @ol = @$ "ol"
    @ol.isotope
      itemSelector: 'li'
      getSortData:
        question:   (elem) -> elem.attr('data-question').toLocaleLowerCase()
        counter:    (elem) -> - parseInt elem.attr('data-counter'), 10
        startdate:  (elem) -> parseInt elem.attr('data-startdate'), 10

  events:
    "click .sort-by span": "sortBy"

  sortBy: (event) =>
    target = $ event.target

    if target.hasClass "selected"
      target.toggleClass "reversed"
    else
      @$(".sort-by .selected").removeClass("selected reversed")
      target.addClass "selected"

    @ol.isotope
      sortBy: target.attr("data-attribute")
      sortAscending: ! target.hasClass "reversed"


# TODO docs
class cliqr.ui.QuestionView extends Backbone.View
  el: '#cliqr-show'

  events:
    "click .fullscreen": "showFS"
    "click .appeal.start button":   "startQuestion"

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
    @resultsView = new cliqr.ui.ResultsView
      model: @model.toJSON().answers

    @model.on "change:answers", @updateAnswers

  render: ->
    @$(".question").append @resultsView.render().el
    @

  updateAnswers: (model, answers, options) =>
    @resultsView.update answers

  startQuestion: (event) ->
    @$(".appeal.start").addClass("busy")


class cliqr.ui.ResultsView extends cliqr.ui.TemplateView
  template_id: 'questions-results'

  enhanceChart: ->
    @$('.chart').remove()

    width  = 300
    counts = @$ ".results .count"
    data   = _.pluck @model, "counter"
    max    = _.max data
    widths = _.map data, (d) -> if max > 0 then d / max * width else 0

    counts.before (index) ->
      $('<span class="chart"></div>').css(width: widths[index]).attr("data-count": data[index])

  enrichedModel: () ->
    sum = _.reduce @model, ((memo, answer) -> memo + answer.counter), 0

    for answer, i in @model
      percent = if sum is 0 then 0 else Math.floor 100 * answer.counter / sum
      _.extend {}, answer,
        nominal: nominal i
        percent: percent

  render: ->
    @$el.html @template answers: @enrichedModel()
    @enhanceChart()
    @

  update: (answers) ->
    @model = answers
    @render()


# TODO
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

  # TODO
  submitForm: (event) ->
      event.preventDefault()
      form = @$ "form"

      return unless form.data("validator").checkValidity()

      url = "questions/" + if @model then "update/#{@model.id}" else "create"
      $.post("#{cliqr.config.PLUGIN_URL}#{url}?cid=#{cliqr.config.CID}", form.serialize())
        .done (msg) ->
          document.location = cliqr.config.PLUGIN_URL + "questions/show/#{msg.id}?cid=" + cliqr.config.CID
        .fail () ->
          console.log "TODO fail", arguments
