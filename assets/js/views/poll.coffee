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

      context =
        poll: @poll?.toJSON()
        pusher_connected: !!cliqr.config.pusherConnected

      @$el.addClass "pusher-mode"

      @$el.html @template context
      @

    postRender: ->
      unless cliqr.config.pusherConnected
        timeout = setTimeout =>
          @$el.removeClass "pusher-mode"
        , 500

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
      @update()
