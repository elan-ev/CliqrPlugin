define [
  'jqm'
  'models/poll_collection'
  'models/back_pusher'
  'routers/poll'
], (jqm, PollCollection, BackPusher, PollRouter) ->

  # The application object
  # Choose a meaningful name for your application
  class PollApp

    initialize: ->
      @prepopulatePolls()
      @initRouter()
      @connectPusher()

      do Backbone.history.start

    ###
    As the webpage contains the initial polls, pre-populate the global
    $Polls (the initial $ indicates a global variable) with these. This
    way we spare us an initial AJAX call.
    ###
    prepopulatePolls: ->
      # TODO globale Variable
      cliqr.$Polls = new PollCollection cliqr.bootstrap.POLLS || []

    ###
    Declare the global $App object (the initial $ indicates a global
    variable). We need it to dynamically navigate between routes etc.
    ###
    initRouter: ->
      # TODO rename this to $Router
      cliqr.$App = new PollRouter()

    ###
    connect it to Pusher
    TODO vllt ein bisschen auslagern
    ###
    connectPusher: ->

      if cliqr.$App.pusherEnabled()

        if cliqr.config.PUSHER_HOST?
          Pusher.host = cliqr.config.PUSHER_HOST

        if cliqr.config.PUSHER_PORT?
          Pusher.ws_port  = cliqr.config.PUSHER_PORT
          Pusher.wss_port = cliqr.config.PUSHER_PORT

        pusher  = new Pusher cliqr.config.PUSHER_APP_KEY
        channel = pusher.subscribe cliqr.config.PUSHER_CHANNEL

        bp = new BackPusher channel
        bp.pushTo cliqr.$Polls
