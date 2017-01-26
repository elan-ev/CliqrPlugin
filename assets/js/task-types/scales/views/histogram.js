import Backbone from 'backbone'
import _ from 'underscore'

const histogramView = function ($statementElement, data, lrange, hrange) {
    require.ensure([ '../../../d3.min' ], function (require) {
        const { axisBottom, deviation, histogram, quantile, scaleLinear, select } = require('../../../d3.min')

        const element = $statementElement.find('svg')[0],
              margin = { top: 20, right: 20, bottom: 30, left: 20 },
              width = Backbone.$(element).width() - margin.left - margin.right,
              height = Backbone.$(element).height() - margin.top - margin.bottom,
              pad0 = 10,
              height0 = height - pad0

        if (width <= 0) {
            return
        }

        data.sort()
        const quantiles = { min: _.first(data), low: quantile(data, .25), median: quantile(data, .5), high: quantile(data, .75), max: _.last(data) }

        const g = select(element)
              .append('g')
              .attr('class', 'histogram')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        let thresholds = hrange - lrange + 1
        let domain, small = false

        if (thresholds <= 20) {
            small = true
            domain = [ lrange - 0.5, hrange + 0.5 ]
        } else {
            domain = [ lrange, hrange ]
            thresholds = 10
        }

        const x = scaleLinear().domain(domain).rangeRound([ 0, width ]),
              d3histogram = histogram().domain(x.domain()).thresholds(thresholds),
              bins = d3histogram(data),
              y = scaleLinear()
              .domain([ 0, _.max(_.pluck(bins, 'length')) ])
              .range([ height0, 0 ])

        if (quantiles.min !== quantiles.max) {
            boxPlot(x, quantiles, g);
        }

        const half = (x(bins[0].x1) - x(bins[0].x0)) / 2,
              bar = g.selectAll('.bar')
              .data(bins)
              .enter().append('g')
              .attr('class', 'bar')
              .attr('transform', d => `translate(${x(d.x0) - (small ? half : 0)},${y(d.length)})`)

        bar.append('rect')
            .attr('x', 1)
            .attr('y', pad0)
            .attr('width', x(bins[0].x1) - x(bins[0].x0))
            .attr('height', d => height0 - y(d.length))

        bar.append('text')
            .attr('dy', '1em')
            .attr('y', pad0)
            .attr('x', (x(bins[0].x1) - x(bins[0].x0)) / 2)
            .attr('text-anchor', 'middle')
            .text(d => d.length || '')

        const axis = axisBottom(x)

        if (!small) {
            // x.nice()
            axis.tickValues(_.unique([ lrange, ...x.ticks().slice(0, -1), hrange ]))
            // axis.tickValues(_.unique([ lrange, ...x.ticks() ]))
        }

        g.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate('+ 0 +',' + height + ')')
            .call(axis)


        function boxPlot(x, quantiles, g) {
            const bp = g.append('g').attr('class', 'box-plot')

            bp.append('line')
                .attr('class', 'center')
                .attr('x1', x(quantiles.min))
                .attr('y1', -10)
                .attr('x2', x(quantiles.max))
                .attr('y2', -10)

            bp.append('rect')
                .attr('class', 'box')
                .attr('x', x(quantiles.low))
                .attr('y', -20)
                .attr('width', x(quantiles.high) - x(quantiles.low))
                .attr('height', 20)

            bp.append('line')
                .attr('class', 'median')
                .attr('x1', x(quantiles.median))
                .attr('y1', -20)
                .attr('x2', x(quantiles.median))
                .attr('y2', 0)

            bp.append('line')
                .attr('class', 'whisker')
                .attr('x1', x(quantiles.min))
                .attr('y1', -20)
                .attr('x2', x(quantiles.min))
                .attr('y2', 0)

            bp.append('line')
                .attr('class', 'whisker')
                .attr('x1', x(quantiles.max))
                .attr('y1', -20)
                .attr('x2', x(quantiles.max))
                .attr('y2', 0)

            bp.append('text')
                .attr('class', 'box')
                .text(quantiles.median)
                .attr('dy', '.3em')
                .attr('dx', '-.3em')
                .attr('x', x(quantiles.median))
                .attr('y', -10)
                .attr('text-anchor', 'end')

            bp.append('text')
                .attr('class', 'box')
                .text(quantiles.low)
                .attr('dy', '1em')
                .attr('dx', '-.3em')
                .attr('x', x(quantiles.low))
                .attr('y', -10)
                .attr('text-anchor', 'end')

            bp.append('text')
                .attr('class', 'box')
                .text(quantiles.high)
                .attr('dy', '1em')
                .attr('dx', '.3em')
                .attr('x', x(quantiles.high))
                .attr('y', -10)
                .attr('text-anchor', 'start')
        }


    }, 'scales-histogram')
}

export default histogramView
