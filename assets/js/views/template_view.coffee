define [
  'backbone'
  'utils'
], (Backbone, utils) ->

  # Extend this class to have access to the specified template
  # which is lazily retrieved on first access

  class TemplateView extends Backbone.View
    template: ->
      @template = utils.compileTemplate @template_id
      @template.apply @, arguments
