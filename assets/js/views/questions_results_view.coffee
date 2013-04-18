define [
  'underscore'
  'views/template_view'
  'views/helpers'
], (_, TemplateView, helpers) ->

  class ResultsView extends TemplateView
    template_id: 'questions-results'

    className: 'results'

    enhanceChart: ->
      @$('.chart').remove()

      width  = 150
      counts = @$ ".count"
      data   = _.pluck @model, "counter"
      max    = _.max data
      widths = _.map data, (d) -> if max > 0 then d / max * width else 0

      @$(".graph").append (index) ->
          jQuery('<span class="chart"></span>')
          .attr("data-count": data[index])
          .css
            width: widths[index]
            marginLeft: if max then width - widths[index] else 0

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

    postRender: ->

    update: (answers) ->
      @model = answers
      @render()
      @postRender()
