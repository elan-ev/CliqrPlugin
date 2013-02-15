define [
  'backbone'
  'utils'

  'models/question'
  'models/questions'

  'views/questions_index'
  'views/questions_new'
  'views/questions_edit'
], (Backbone, utils,
    Question, QuestionCollection,
    QuestionsIndexView, QuestionsNewView, QuestionsEditView) ->

  class QuestionsRouter extends Backbone.Router

    routes:
      "":         "index"
      "index":    "index"
      "new":      "newQuestion"
      "edit-:id": "editQuestion"

    # ROUTE: "#index"
    index: ->
      @showLoading()
      @fetchQuestions (questions) =>
        @hideLoading()
        utils.changeToPage new QuestionsIndexView collection: questions

    # ROUTE: "#new"
    newQuestion: ->
      utils.changeToPage new QuestionsNewView

    # ROUTE: "#edit-:id"
    editQuestion: (id) ->
      @showLoading()
      @fetchQuestion id, (question) =>
        utils.changeToPage new QuestionsEditView model: question
        @hideLoading()



    # TODO should return a promise instead
    fetchQuestions: (callback) ->
      if cliqr.config.POLLS
        questions = new QuestionCollection cliqr.config.POLLS
        delete cliqr.config.POLLS
        callback questions

      else
        questions = new QuestionCollection
        questions.fetch().done ->
          callback questions

    # TODO should return a promise instead
    fetchQuestion: (id, callback) ->
      if cliqr.config.POLLS
        questions = new QuestionCollection cliqr.config.POLLS
        delete cliqr.config.POLLS
        callback questions.get id

      else
        question = new Question id: id
        question.fetch().done =>
          callback question


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
