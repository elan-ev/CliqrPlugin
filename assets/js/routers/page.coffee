define [
  'backbone'
  'jquery'
], (Backbone, jQuery) ->

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
      jQuery(page.el).attr('data-role', 'page')
      page.render()
      jQuery('body').append jQuery page.el
      page.postRender?()

      ###
      do not use transition for first page
      ###
      transition = jQuery.mobile.defaultPageTransition
      if @firstPage
        transition = 'none'
        @firstPage = false

      ###
      call the jqm function
      ###
      jQuery.mobile.changePage jQuery(page.el),
        changeHash: false
        transition: transition
