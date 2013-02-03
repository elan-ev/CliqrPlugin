define [
  'backbone'
  'jquery'
], (Backbone, $) ->

  ###
  TODO: docu für pollview
  ###
  PageView = do ->

    enhancePage = (el) ->
      $(el).page("destroy").page() if el.parentNode

    Backbone.View.extend
      initialize: ->
        old_render = @render
        @render = ->
          view = old_render.apply @, arguments
          enhancePage view.el
          view
