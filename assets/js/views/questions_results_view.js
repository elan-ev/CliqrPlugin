import Backbone from 'backbone'
import _ from 'underscore'
import TemplateView from './template_view'
import helpers from './helpers'

const ResultsView = TemplateView.extend({

    template_id: 'questions-results',
    className: 'results',

    enhanceChart() {
        this.$('.chart').remove()

        const width = 150,
              counts = this.$('.count'),
              data = _.pluck(this.model, 'counter'),
              max = _.max(data),
              widths = _.map(data, (d) => max > 0 ? d / max * width : 0)

        this.$('.graph').append(function (index) {
            return Backbone.$('<span class="chart"></span>').attr({
                'data-count': data[index]
            }).css({
                width: widths[index],
                marginLeft: max ? width - widths[index] : 0
            })
        })
    },

    enrichedModel() {
        const size = _.reduce(this.model, (function (memo, answer) {
          return memo + answer.counter;
        }), 0)

        const answers = _.map(this.model, (answer, i) => {
            const percent = size === 0 ? 0 : Math.floor(100 * answer.counter / size)
            return _.extend({}, answer, { nominal: helpers.nominal(i), percent })
        })

        return { size, answers }
    },

    render() {
        this.$el.html(this.template(this.enrichedModel()))
        this.enhanceChart()
        return this
    },

    update(answers) {
        this.model = answers
        this.render()
        this.postRender()
    }
})

export default ResultsView
