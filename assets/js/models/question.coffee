define [
  'backbone'
], (Backbone) ->

  # Model representing a Question
  class Question extends Backbone.Model
    url: ->
      cliqr.config.PLUGIN_URL + "questions/show/#{@get 'id'}?cid=" + cliqr.config.CID
