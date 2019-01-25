import Backbone from 'backbone'
import _ from 'underscore'

export default function($statementElement, data, lrange, hrange) {
    const element = $statementElement.find('svg')[0],
        margin = { top: 20, right: 20, bottom: 30, left: 20 },
        width = Backbone.$(element).width() - margin.left - margin.right,
        height = Backbone.$(element).height() - margin.top - margin.bottom

    import(/* webpackChunkName: "d3" */ './d3')
        .then(({ default: d3 }) => {
            _histogramView(d3, element, data, lrange, hrange, width, height, margin)
        })
        .catch(() => 'An error occurred while loading d3js')
}

function _histogramView(d3, element, data, lrange, hrange, width, height, margin) {
    const g = d3
        .select(element)
        .append('g')
        .attr('class', 'histogram')

    // background
    g.append('rect')
        .attr('fill', '#ccf')
        .attr('fill-opacity', '0.2')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

    const domain = [lrange, hrange]
    const domainExtent = hrange - lrange + 1
    const small = domainExtent <= 20

    const thresholds = small ? domainExtent : 10
    const d3histogram = d3
        .histogram()
        .domain(domain)
        .thresholds(thresholds)
    const bins = d3histogram(data)

    const y = d3
        .scaleLinear()
        .domain([0, Math.max(...bins.map(b => b.length)) * 1.1])
        .nice()
        .range([height, 0])

    let x, xAxis
    if (small) {
        const smallDomain = _.range(lrange, hrange + 1)
        x = d3
            .scaleBand()
            .domain(smallDomain)
            .range([margin.left, width + margin.left])
            .padding(0.1)
        xAxis = d3.axisBottom(x).tickSizeOuter(0)
    } else {
        x = d3
            .scaleLinear()
            .domain(domain)
            .rangeRound([margin.left, width + margin.left])
        const tickValues = _.uniq([...bins.map(b => b.x0), lrange, hrange])
        xAxis = d3.axisBottom(x).tickValues(tickValues)
    }

    const bar = g
        .selectAll('.bar')
        .data(bins)
        .enter()
        .append('g')
        .attr('class', 'bar')

    bar.append('rect')
        .attr('x', (d, i) => (small ? x(lrange + i) : x(d.x0)))
        .attr('width', d => (small ? x.bandwidth() : x(d.x1) - x(d.x0)))
        .attr('y', d => margin.top + y(d.length))
        .attr('height', d => y(0) - y(d.length))

    bar.append('text')
        .attr('class', 'bin')
        .attr('dy', '-0.5em')
        .attr('y', d => margin.top + y(d.length))
        .attr('x', (d, i) => (small ? x(lrange + i) + 0.5 * x.bandwidth() : (x(d.x1) + x(d.x0)) / 2))
        .attr('text-anchor', 'middle')
        .text(d => d.length || '')

    g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${height + margin.top})`)
        .call(xAxis)
}
