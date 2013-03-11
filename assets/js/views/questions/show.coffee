define [
  'utils'
  'models/question'
  'views/template_view'
  'views/questions_results_view'
], (utils, Question, TemplateView, ResultsView) ->

  class QuestionView extends TemplateView
    template_id: "questions-show"

    className: "page questions-show"

    events:
      "click button.start":            "startQuestion"
      "click button.stop":             "stopQuestion"
      "click a.qr":                    "showQRCode"
      "submit form.questions-destroy": "confirmDestroy"
      "click .fullscreen":             "showFS"

    initialize: ->
      @resultsView = new ResultsView
        model: @model.toJSON().answers

      @listenTo @model, "change:answers", @updateAnswers
      @listenTo @model, "change:state",   @updateState

      @interval = setInterval (=> do @model.fetch), 2000

    remove: ->
      clearInterval @interval
      super()


    render: ->
      context = _.extend @model.toJSON(),
        qr_code:   cliqr.config.PLUGIN_URL + "qr/" + cliqr.config.CID
        short_url: cliqr.config.SHORT_URL

      @$el.html @template context
      @$(".question").append @resultsView.render().el
      @

    updateAnswers: (model, answers, options) =>
      @resultsView.update answers

    updateState: (model, state, options) =>
      # TODO currently we reload the page on state change
      #      this should not be necessary
      #do document.location.reload
      @render()

    showQRCode: (event) ->
      # do not show code, handle this on your own
      event.preventDefault()
      @$(".question").toggleClass "qr-visible"

    confirmDestroy: (event) ->
      unless window.confirm $(event.target).data "confirm"
        event.preventDefault()

    showFS: (event) ->
      event.preventDefault()

      container = $(".question")[0]

      methods = ["requestFullscreen", "mozRequestFullScreen", "webkitRequestFullscreen"]
      for method in methods when container[method]
        do container[method]
        break


    startQuestion: (event) ->
      event.preventDefault()
      @$(".appeal.start").addClass("busy")
      @model.start().done(=> @model.fetch()).always -> console.log arguments



    stopQuestion: (event) ->
      event.preventDefault()
      @model.stop().done(=> @model.fetch()).always -> console.log arguments
