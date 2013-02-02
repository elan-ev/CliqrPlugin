define [
  'backbone'
  'underscore'
  'views/template_view'
  'views/helpers'
], (Backbone, _, TemplateView, helpers) ->

  class ResultsView extends TemplateView
    template_id: 'questions-results'

    className: 'results'

    enhanceChart: ->
      @$('.chart').remove()

      width  = 300
      counts = @$ "ol .count"
      data   = _.pluck @model, "counter"
      max    = _.max data
      widths = _.map data, (d) -> if max > 0 then d / max * width else 0

      counts.before (index) ->
        $('<span class="chart"></div>').css(width: widths[index]).attr("data-count": data[index])

    enrichedModel: () ->
      size = _.reduce @model, ((memo, answer) -> memo + answer.counter), 0

      size: size
      answers:
        for answer, i in @model
          percent = if size is 0 then 0 else Math.floor 100 * answer.counter / size
          _.extend {}, answer,
            nominal: helpers.nominal i
            percent: percent

    render: ->
      @$el.html @template @enrichedModel()
      @enhanceChart()
      @

    update: (answers) ->
      @model = answers
      @render()
