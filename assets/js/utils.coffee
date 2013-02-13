define [
  'handlebars'
  'underscore'
], (Handlebars, _) ->

  # TODO: $ has to be defined

  previousPages = []

  changeToPage: (view) ->

    container = $("#layout_container")
    pages = container.children(".page")

    # get current then add new page to stack
    current = _.last previousPages
    previousPages.push view

    # trigger page-after-hide event on current page
    if current
      current.$el.hide()
      Backbone.trigger 'page-after-hide', current

    # render that view
    view.render()

    # append new unless already in DOM
    unless view.el.parentNode
      container.prepend view.$el.hide()

    # trigger page-before-show
    Backbone.trigger 'page-before-show', view
    view.$el.show()
    Backbone.trigger 'page-after-show', view


  # TODO
  changeToPreviousPage: () ->
    if previousPages.length < 2
      throw new Error 'There is no previous page'

    current = previousPages.pop()
    previous = _.last previousPages

    current.$el.hide()
    Backbone.trigger 'page-after-hide', current
    Backbone.trigger 'page-before-show', previous
    previous.$el.show()
    Backbone.trigger 'page-after-show', previous
    current.remove()


  # We use Handlebars as template engine. This function makes it a lot
  # easier to get a pre-compiled Handlebars template.
  compileTemplate: _.memoize (name) ->
    Handlebars.compile $("#cliqr-template-#{name}").html()
