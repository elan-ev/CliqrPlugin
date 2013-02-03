define [
  'backbone'
  'models/poll'
  'models/id_list'
], (Backbone, Poll, id_list) ->

  ###
  TODO: docs für PollCollection
  ###
  class PollCollection extends Backbone.Collection
    model: Poll

    url: ->
      cliqr.config.PLUGIN_URL + "poll/" + cliqr.config.CID

    comparator: (poll) ->
      poll.get 'startdate'

    firstFresh: ->
      @find (model) ->
        not id_list.test model.id
