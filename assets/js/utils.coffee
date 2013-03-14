define [
  'handlebars'
  'underscore'
], (Handlebars, _) ->

  currentView = false

  changeToPage: (view) ->

    # remove previous view
    if currentView
      currentView.$el.hide()
      currentView.remove()

    currentView = view
    $(window).scrollTop 0

    # render that view
    container = $("#layout_container")
    container.prepend view.render().$el
    view.postRender?()

  # We use Handlebars as template engine. This function makes it a lot
  # easier to get a pre-compiled Handlebars template.
  compileTemplate: _.memoize (name) ->
    Handlebars.compile $("#cliqr-template-#{name}").html()
