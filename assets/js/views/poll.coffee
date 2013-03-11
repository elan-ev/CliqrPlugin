define [
  'underscore'
  'jquery'
  'utils'
  'views/helpers'
  'views/page'
  'models/id_list'
], (_, $, utils, helpers, PageView, id_list) ->

  ###
  TODO: docu für pollview
  ###
  class PollView extends PageView
    # TODO combinable with TemplateView?
    template: utils.compileTemplate("poll")

    className: "page"

    events:
      "submit form": "recordAnswer"

    initialize: (options) ->
      super options

      @listenTo @collection, "all", @update
      @listenTo Backbone, "pusher_connected", @onPusherConnected

    update: ->
      do @render
      do @postRender

    timeout = null

    render: ->
      @poll = @collection.firstFresh()

      if @poll
        for answer, index in @poll.get('answers')
          answer.nominal = helpers.nominal index

      context = poll: @poll?.toJSON()

      @setMode "pusher"  if cliqr.config.pusherConnected

      @$el.html @template context
      @

    postRender: ->
      unless cliqr.config.pusherConnected
        timeout = setTimeout =>
          @setMode "reload"
        , 500

    setMode: (mode) ->
      @$el.attr "data-mode", mode

    recordAnswer: (event) =>
      event.preventDefault()

      # @poll should be unanswered
      unless id_list.test @poll
        $.post(cliqr.$Polls.url(), @$("form").serialize())
          .always () =>
            id_list.add @poll
          .done (msg) =>
            @update()
          .fail (jqXHR, textStatus) ->
            return
      else
        alert "TODO poll was already answered"

    onPusherConnected: ->
      cliqr.config.pusherConnected = true
      clearTimeout timeout
      @setMode "pusher"
