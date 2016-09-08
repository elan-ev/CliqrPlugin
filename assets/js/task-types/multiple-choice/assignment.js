import Backbone from 'backbone'
import _ from 'underscore'

const decorateTask = function (task, voting = null) {
    const task_id = task.get('id'),
          votes = tallyVotes(task, voting),
          json = voting.toJSON(),
          votes_total = _.reduce(votes, (sum, n) => { return sum + n }, 0)


    return {
        ...json,
        task: _.first(json.test.tasks),
        isRunning: voting.isRunning(),
        answers: _.map(task.get('task').answers,
                       function (nswr, i) {
                           return {
                               ...nswr,
                               id: `${task_id}-${i}`,
                               isCorrect: !!nswr.score,
                               votes_count: votes[i],
                               percent: votes_total ? Math.floor(votes[i] / votes_total * 100) : 0
                           }}),
        isSingleSelect: task.get('task')['type'] === 'single',
        votes_count: votes_total
    }
}

const tallyVotes = function (task, voting) {
    const counts = []
    for (let i = 0, len = task.get('task').answers.length; i < len; ++i) {
        counts[i] = 0
    }
    return _.reduce(voting && voting.get('responses'), (memo, response) => {
        _.each(response.answer, (answer) => memo[answer]++)
        return memo
    }, counts)
}

const AssignmentView = Backbone.View.extend({

    tagName: 'section',

    className: 'cliqr--multiple-choice-assignment-view',

    initialize(options) {
        this.voting = options.voting
    },

    render() {
        const template = require('./multiple-choice-assignment.hbs'),
              context = decorateTask(this.model, this.voting)

        this.$el.html(template(context))

        if (!this.voting.isRunning()) {
            this.enhanceChart(context)
        }

        return this
    },

    enhanceChart(context) {
        this.$('.chart').remove()

        const width = 150,
              data = context.answers,
              max = _.max(_.pluck(data, 'votes_count')),
              widths = _.map(data, (d) => max > 0 ? d.votes_count / max * width : 0)

        this.$('.graph').append(function (index) {
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

export default AssignmentView
