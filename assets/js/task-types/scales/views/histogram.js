import Backbone from 'backbone'
import _ from 'underscore'

const histogramView = function (element, data, lrange, hrange) {
    require.ensure([ '../../../d3.min' ], function (require) {
        const { histogram, axisBottom, select, scaleLinear } = require('../../../d3.min')

        const margin = { top: 20, right: 20, bottom: 30, left: 20 }
        const width = Backbone.$(element).width() - margin.left - margin.right
        const height = Backbone.$(element).height() - margin.top - margin.bottom

        const g = select(element)
              .append('g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        //lrange = -10
        //hrange = 99

        let thresholds = hrange - lrange + 1
        let domain, small = false

        if (thresholds <= 20) {
            small = true
            domain = [ lrange - 0.5, hrange + 0.5 ]
        } else {
            domain = [ lrange, hrange ]
            thresholds = 10
        }
        const x = scaleLinear()
              .domain(domain)
              .rangeRound([ 0, width ])

        const d3histogram = histogram().domain(x.domain()).thresholds(thresholds)

        const bins = d3histogram(data)

        const y = scaleLinear()
            .domain([ 0, _.max(_.pluck(bins, 'length')) ])
            .range([ height, 0 ])

        /*
          g.append('text')
          .text(`Durchschnitt: ${mean(data)}`)
          .attr('transform', 'translate('+ 0 +',' + (height + 30) + ')')
        */

        const half = (x(bins[0].x1) - x(bins[0].x0)) / 2

        const bar = g.selectAll('.bar')
            .data(bins)
            .enter().append('g')
            .attr('class', 'bar')
            .attr('transform', d => `translate(${x(d.x0) - (small ? half : 0)},${y(d.length)})`)

        bar.append('rect')
            .attr('x', 1)
            .attr('width', x(bins[0].x1) - x(bins[0].x0))
            .attr('height', d => height - y(d.length))

        bar.append('text')
            .attr('y', '1em')
            .attr('x', (x(bins[0].x1) - x(bins[0].x0)) / 2)
            .attr('text-anchor', 'middle')
        // TODO
            .attr('fill', '#ffffff')
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
            /*
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
            */
    }, 'scales-histogram')
}

export default histogramView
