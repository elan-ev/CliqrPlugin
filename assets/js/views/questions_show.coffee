define [
  'backbone'
  'utils'
  'models/question'
  'views/questions_results_view'
], (Backbone, utils, Question, ResultsView) ->

  class QuestionView extends Backbone.View
    events:
      # "click .fullscreen":             "showFS"
      "click .appeal.start button":    "startQuestion"
      "click a.qr":                    "showQRCode"
      "submit form.questions-destroy": "confirmDestroy"

    ###
    showFS: ->
      container = @$("#layout_page")[0]
      if container.requestFullscreen
        container.requestFullscreen()
      else if container.mozRequestFullScreen
        container.mozRequestFullScreen()
      else if container.webkitRequestFullscreen
        container.webkitRequestFullscreen()
      false
    ###

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
