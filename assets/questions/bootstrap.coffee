###
Provide top-level namespaces for our javascript.
###
window.cliqr ||=
  config: {}
  model: {}
  router: {}
  ui: {}

jQuery ($) ->
  if $('#cliqr-index').length
    questions = new cliqr.ui.QuestionsIndexView()

  if $('#cliqr-show').length
    model = new cliqr.model.Question cliqr.model.$currentQuestion
    question = new cliqr.ui.QuestionView model: model
    setInterval ->
        model.fetch()
      , 2000


  setTimeout (-> $(".self-destroy").remove()), 5000
