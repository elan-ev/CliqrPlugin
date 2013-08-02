define [
  'backbone'
  'routers/questions'
  'views/questions_helpers'
], (Backbone, QuestionsRouter, _helpers) ->

  # The application object
  # Choose a meaningful name for your application
  class QuestionsApp

    initialize: ->
      @initStuff()
      @initRouters()

      do Backbone.history.start


    # TODO clean this up!
    initStuff: ->
      do detectFeatures

      # destroy self-destroy messages
      setTimeout (-> jQuery(".self-destroy").remove()), 5000


    initRouters: ->
      router = new QuestionsRouter


    detectFeatures = ->

      return  if window.Modernizr

      mStyle = window.document.createElement('modernizr').style
      cssomPrefixes = 'Webkit Moz O ms'.split ' '

      testProp = (prop) ->
        ucProp = prop.charAt(0).toUpperCase() + prop.slice(1)
        props  = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split ' '

        return true for i in props when mStyle[i] != undefined

        false

      addCssClass = (prop, truthy) ->
        pref = if truthy then '' else 'no-'
        window.document.documentElement.className += ' ' + pref  + prop

      addCssClass "flexbox", testProp "flexWrap"
      addCssClass "flexboxlegacy", testProp "boxDirection"
