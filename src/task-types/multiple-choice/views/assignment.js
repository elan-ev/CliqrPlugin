import Backbone from 'backbone'
import { View } from 'backbone.marionette'
import _ from 'underscore'
import template from '../hbs/assignment.hbs'

const decorateTask = function(task, voting = null) {
    const task_id = task.get('id'),
        votes = tallyVotes(task, voting),
        json = voting.toJSON(),
        votes_total = votes.reduce((sum, n) => sum + n, 0),
        isSingleSelect = task.get('task')['type'] === 'single',
        responses_total = voting.get('responses').length

    return {
        ...json,
        task: _.first(json.test.tasks),
        isRunning: voting.isRunning(),
        answers: _.map(task.get('task').answers, function(nswr, i) {
            let percent = 0

            if (isSingleSelect && votes_total) {
                percent = votes[i] / votes_total
            } else if (!isSingleSelect && responses_total) {
                percent = votes[i] / responses_total
            }

            return {
                ...nswr,
                id: `${task_id}-${i}`,
                isCorrect: !!nswr.score,
                votes_count: votes[i],
                percent: Math.floor(percent * 100)
            }
        }),
        isSingleSelect,
        votes_count: votes_total
    }
}

const tallyVotes = function(task, voting) {
    const counts = []
    for (let i = 0, len = task.get('task').answers.length; i < len; ++i) {
        counts[i] = 0
    }
    return _.reduce(
        voting && voting.get('responses'),
        (memo, response) => {
            _.each(response.answer, answer => memo[answer]++)
            return memo
        },
        counts
    )
}

export default View.extend({
    tagName: 'section',

    className: 'cliqr--multiple-choice-assignment-view',

    initialize({ voting }) {
        this.voting = voting

        this.listenTo(this.voting, 'change', this.render)
    },

    template,

    templateContext() {
        return decorateTask(this.model, this.voting)
    },

    onAttach() {
        if (!this.voting.isRunning()) {
            this.enhanceChart(this.templateContext())
        }

        const Hub = window.MathJax.Hub
        this.$('.cliqr--mc-description, td.text').each((index, element) => Hub.Queue(['Typeset', Hub, element]))
    },

    enhanceChart(context) {
        this.$('.chart').remove()

        const width = 150,
            data = context.answers,
            max = _.max(_.map(data, 'votes_count')),
            widths = _.map(data, d => (max > 0 ? (d.votes_count / max) * width : 0))

        this.$('.graph').append(function(index) {
            if (!data[index].votes_count) {
                return null
            }
            return Backbone.$('<span class="chart"></span>').css({
                width: widths[index],
                marginLeft: max ? width - widths[index] : 0
            })
        })
    }
})
