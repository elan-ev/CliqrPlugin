define [
  'backbone'
], (Backbone) ->

  # TODO please fix the sync
  actionMap =
    create: 'create'
    update: 'update'
    delete: 'destroy'
    read:   'show'

  # Model representing a Question
  class Question extends Backbone.Model

    sync: (method, model, options) ->
      _.extend options, url: model.url?(actionMap[method])
      Backbone.sync method, model, options

    url: (action) ->
      id = if @id? then "/#{@id}" else ""
      cliqr.config.PLUGIN_URL + "questions/#{action}#{id}?cid=" + cliqr.config.CID

    start: ->
      url = cliqr.config.PLUGIN_URL + "questions/start/#{@id}?cid=" + cliqr.config.CID
      promise = $.post url

    stop: ->
      url = cliqr.config.PLUGIN_URL + "questions/stop/#{@id}?cid=" + cliqr.config.CID
      promise = $.post url
