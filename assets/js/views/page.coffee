define [
  'backbone'
  'jquery'
], (Backbone, jQuery) ->

  ###
  TODO: docu für pollview
  ###
  PageView = do ->

    enhancePage = (el) ->
      jQuery(el).page("destroy").page() if el.parentNode

    Backbone.View.extend
      initialize: ->
        old_render = @render
        @render = ->
          view = old_render.apply @, arguments
          enhancePage view.el
          view
