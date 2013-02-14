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
      @listenTo @collection, "all", @render

    render: ->

      @poll = @collection.firstFresh()

      if @poll
        for answer, index in @poll.get('answers')
          answer.nominal = helpers.nominal index

      context =
        poll: @poll?.toJSON()
        pusher_enabled: cliqr.$App.pusherEnabled()

      @$el.html @template context
      @


    recordAnswer: (event) =>
      event.preventDefault()

      # @poll should be unanswered
      unless id_list.test @poll
        $.post(cliqr.$Polls.url(), @$("form").serialize())
          .always () =>
            id_list.add @poll
          .done (msg) =>
            @render()
          .fail (jqXHR, textStatus) ->
            return
      else
        alert "TODO poll was answered already"
