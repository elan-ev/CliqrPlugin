define [
  'handlebars'
  'underscore'
], (Handlebars, _) ->

  # TODO: $ has to be defined

  previousPages = []

  changeToPage: (view) ->

    el = $ view.render().el
    container = $("#layout_container")
    pages = container.children(".page")

    # get current then add new page to stack
    current = _.last previousPages
    previousPages.push view

    # append new unless already in DOM
    unless el[0].parentNode
      container.prepend el.hide()

    # trigger page-hide event on current page
    current.trigger('page-hide').$el.hide()  if current

    el.show()

    return


  # TODO
  changeToPreviousPage: () ->
    if previousPages.length < 2
      throw new Error 'There is no previous page'

    current = previousPages.pop()
    previous = _.last previousPages

    current.$el.hide()
    previous.$el.show()
    current.remove()


  # We use Handlebars as template engine. This function makes it a lot
  # easier to get a pre-compiled Handlebars template.
  compileTemplate: _.memoize (name) ->
    Handlebars.compile $("#cliqr-template-#{name}").html()
