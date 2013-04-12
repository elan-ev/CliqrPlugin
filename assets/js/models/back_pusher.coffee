define [
  'underscore'
], (_) ->

  ###
  TODO
  ###
  class BackPusher
    constructor: (@channel) ->

    events:
      started: "add"
      stopped: "remove"

    pushTo: (collection) ->
      @channel.bind(event, _.bind @[method], @, collection) for event, method of @events

    add: (collection, question) ->
      collection.add question, merge: true

    remove: (collection, id) ->
      collection.remove model  if model = collection.get id
