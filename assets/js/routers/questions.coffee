define [
  'backbone'
  'utils'

  'models/question'
  'models/questions'

  'views/questions_index'
  'views/questions_new'
  'views/questions_edit'
  'views/questions/show'
], (Backbone, utils,
    Question, QuestionCollection,
    QuestionsIndexView, QuestionsNewView, QuestionsEditView, QuestionView) ->

  class QuestionsRouter extends Backbone.Router

    routes:
      "":         "index"
      "index":    "index"
      "new":      "newQuestion"
      "edit-:id": "editQuestion"
      "show-:id": "showQuestion"

    # ROUTE: "#index"
    index: ->
      @showLoading()
      @fetchQuestions().done (questions) =>
        @hideLoading()
        utils.changeToPage new QuestionsIndexView collection: questions

    # ROUTE: "#new"
    newQuestion: ->
      utils.changeToPage new QuestionsNewView

    # ROUTE: "#edit-:id"
    editQuestion: (id) ->
      @showLoading()
      @fetchQuestion(id).done (question) =>
        @hideLoading()
        utils.changeToPage new QuestionsEditView model: question

    # ROUTE: "#show-:id"
    showQuestion: (id) ->
      @showLoading()
      @fetchQuestion(id).done (question) =>
        @hideLoading()
        utils.changeToPage new QuestionView model: question


    # instantiate then remove bootstrapped
    bootstrapQuestions = ->
      questions = new QuestionCollection cliqr.bootstrap.POLLS
      delete cliqr.bootstrap.POLLS
      questions


    # TODO should return a promise instead
    fetchQuestions: (callback) ->
      if cliqr.bootstrap.POLLS
        $.Deferred()
         .resolve(bootstrapQuestions())
         .promise()

      else
        questions = new QuestionCollection
        questions.fetch().pipe -> questions # TODO (mlunzena) pipe should be then

    # TODO should return a promise instead
    fetchQuestion: (id, callback) ->
      if cliqr.bootstrap.POLLS
        $.Deferred()
         .resolve(bootstrapQuestions().get(id))
         .promise()

      else
        question = new Question id: id
        question.fetch().pipe -> question # TODO (mlunzena) pipe should be then


    # Loader stuff - TODO should not be here, AppView?

    loader = false
    timeout = false

    showLoading: ->
      timeout = setTimeout ->
          loader = $('<span class="cliqr-loader"/>').html("Loading...").prependTo("#layout_container")
        , 300

    hideLoading: ->
      clearTimeout timeout
      loader.remove() if loader
