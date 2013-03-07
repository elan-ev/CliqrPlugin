define [
  'backbone'
  'jquery'
], (Backbone, $) ->

  ###
  Customized Backbone.Router playing nicely with jqm
  ###
  class PageRouter extends Backbone.Router

    initialize: ->
      @firstPage = true

    ###
    Internal function to be used by the route handlers.

    `page` is a Backbone.View which is added as a jQuery mobile page to
    the pageContainer. Eventually, after all the setup mojo and
    everything is in place, the `jQuery mobile way`(TM) of changing
    pages is invoked.
    ###
    changePage: (page) ->

      ###
      add "data-role=page" to the element of the page, then render and insert into the body
      ###
      $(page.el).attr('data-role', 'page')
      page.render()
      $('body').append $ page.el
      page.postRender?()

      ###
      do not use transition for first page
      ###
      transition = $.mobile.defaultPageTransition
      if @firstPage
        transition = 'none'
        @firstPage = false

      ###
      call the jqm function
      ###
      $.mobile.changePage $(page.el),
        changeHash: false
        transition: transition
