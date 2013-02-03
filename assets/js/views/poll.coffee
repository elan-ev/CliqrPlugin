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
      @collection.on "all", @render, @

    render: ->

      poll = @collection.firstFresh()

      if poll
        for answer, index in poll.get('answers')
          answer.nominal = helpers.nominal index

      @$el.html @template poll: poll?.toJSON()
      @

    recordAnswer: (event) =>
      event.preventDefault()

      id = @$("input[name=vote_id]", event.target).val()

      if id_list.test id
        alert "ha!"
      else
        $.post(cliqr.$Polls.url(), @$("form").serialize())
          .always () ->
            id_list.add id
          .done (msg) =>
            @render()
          .fail (jqXHR, textStatus) ->
            return
