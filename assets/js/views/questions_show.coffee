define [
  'backbone'
  'utils'
  'models/question'
  'views/questions_results_view'
], (Backbone, utils, Question, ResultsView) ->

  class QuestionView extends Backbone.View
    events:
      "click .appeal.start button":    "startQuestion"
      "click a.qr":                    "showQRCode"
      "submit form.questions-destroy": "confirmDestroy"
      "click .fullscreen":             "showFS"

    showFS: ->
      container = $(".question")[0]

      methods = ["requestFullscreen", "mozRequestFullScreen", "webkitRequestFullscreen"]
      for method in methods when container[method]
        do container[method]
        break

      false

    initialize: ->
      @resultsView = new ResultsView
        model: @model.toJSON().answers

      @listenTo @model, "change:answers", @updateAnswers
      @listenTo @model, "change:state",   @updateState

    render: ->
      @$(".question").append @resultsView.render().el
      @

    updateAnswers: (model, answers, options) =>
      @resultsView.update answers

    updateState: (model, state, options) =>
      # TODO currently we reload the page on state change
      #      this should not be necessary
      do document.location.reload

    startQuestion: (event) ->
      @$(".appeal.start").addClass("busy")

    showQRCode: (event) ->
      # do not show code, handle this on your own
      event.preventDefault()
      @$(".question").toggleClass "qr-visible"

    confirmDestroy: (event) ->
      unless window.confirm $(event.target).data "confirm"
        event.preventDefault()
