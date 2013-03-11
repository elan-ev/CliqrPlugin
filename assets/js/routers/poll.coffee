define [
  'backbone'
  'routers/page'
  'views/poll'
], (Backbone, PageRouter, PollView) ->

  ###
  The singleton AppRouter containing the handlers for all the routes.
  ###
  class PollRouter extends PageRouter

    routes:
      "": "showPoll"

    showPoll: ->
      @changePage new PollView collection: cliqr.$Polls

    pusherEnabled: ->
      cliqr.config.PUSHER_APP_KEY?
