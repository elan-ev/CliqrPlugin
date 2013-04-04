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
    jQuery(window).scrollTop 0

    # render that view
    container = jQuery("#layout_container")
    container.prepend view.render().$el
    view.postRender?()

  # We use Handlebars as template engine. This function makes it a lot
  # easier to get a pre-compiled Handlebars template.
  compileTemplate: _.memoize (name) ->
    Handlebars.compile jQuery("#cliqr-template-#{name}").html()
