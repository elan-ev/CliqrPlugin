define [
  'backbone'
  'utils'
  'underscore'
  'views/questions_form'
  'views/questions_helpers'
], (Backbone, utils, _, QuestionsForm, QuestionsListView, _helpers) ->

  class QuestionsIndexView extends Backbone.View
    className: "page"

    initialize: ->
      @

    render: ->
      template = utils.compileTemplate 'questions-index'
      template_table = utils.compileTemplate 'questions-index-table'
      
      q_new = @collection.where(state: "new")
      q_active = @collection.where(state: "active")
      q_stopped = @collection.where(state: "stopvis")
      
      tables = 
        table_new: template_table({
          questions: _.invoke q_new, "toJSON"
          state: "new"})
        table_active: template_table({
          questions: _.invoke q_active, "toJSON"
          state: "active"})
        table_stopped: template_table({
          questions: _.invoke q_stopped, "toJSON"
          state: "stopped"})

      @$el.html template(tables)
      @
      
    postRender: ->
      $("#questions-table.new").tablesorter();
      $("#questions-table.active").tablesorter();
      $("#questions-table.stopped").tablesorter();