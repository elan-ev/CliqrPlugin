###
Provide top-level namespaces for our javascript.
###
window.cliqr ||=
  config: {}
  model: {}
  router: {}
  ui: {}

# TODO docs
cliqr.router.changeToPage =
  do (previous = false) ->
    (view) ->

      previous.trigger 'page-hide' if previous

      el = $ view.render().el
      container = $("#layout_container")
      pages = container.children(".page")

      pages.not(el).hide 'slide', {duration: 200, direction: 'left'}, ->
        el.show 'slide', {duration: 200, direction: 'right'}

      container.append el unless pages.is(el)

      previous = view

jQuery ($) ->
  # destroy self-destroy messages
  setTimeout (-> $(".self-destroy").remove()), 5000

  # Route: questions/index
  if $('#cliqr-index').length
    # initiate view
    questions = new cliqr.ui.QuestionsIndexView
      el: $ '#cliqr-index .page'

    cliqr.router.changeToPage questions


  # Route: questions/show
  if $('#cliqr-show').length
    # prepare model
    model = new cliqr.model.Question cliqr.model.$currentQuestion
    setInterval (-> do model.fetch), 2000

    # initiate view
    question = new cliqr.ui.QuestionView
      el: $ '#cliqr-show .page'
      model: model

    cliqr.router.changeToPage question
