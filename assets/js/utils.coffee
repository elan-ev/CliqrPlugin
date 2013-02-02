define [
  'mustache'
  'underscore'
], (Mustache, _) ->

  # TODO: $ has to be defined

  previousPage = false

  changeToPage: (view) ->

    previousPage.trigger('page-hide') if previousPage

    el = $ view.render().el
    container = $("#layout_container")
    pages = container.children(".page")

    pages.not(el).hide 'slide', {duration: 200, direction: 'left'}, ->
      el.show 'slide', {duration: 200, direction: 'right'}

    container.append el unless pages.is(el)
    previousPage = view

  # We use Mustache as template engine. This function makes it a lot
  # easier to get a pre-compiled Mustache template.
  compileTemplate: _.memoize (name) ->
    Mustache.compile $("#cliqr-template-#{name}").html()
