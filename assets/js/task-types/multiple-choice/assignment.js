import Backbone from 'backbone'
import _ from 'underscore'

const decorateTask = function (task, voting = null) {
    const task_id = task.get('id'),
          votes = tallyVotes(task, voting),
          json = voting.toJSON()

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
                               votes_count: votes[i]
                           }}),
        isSingleSelect: task.get('task')['type'] === 'single',
        votes_count:  _.reduce(votes, (sum, n) => { return sum + n }, 0)
    }
}

const tallyVotes = function (task, voting) {
    const counts = []
    for (let i = 0, len = task.get('task').answers.length; i < len; ++i) {
        counts[i] = 0
    }

    return _.reduce(voting && voting.get('responses'), (memo, response) => {
        memo[response.answer]++
        return memo
    }, counts)
}

const AssignmentView = Backbone.View.extend({
    initialize(options) {
        this.voting = options.voting
    },

    render() {
        const template = require('../../../hbs/task-types/multiple-choice-assignment.hbs')
        this.$el.html(template(decorateTask(this.model, this.voting)))
        return this
    }
})

export default AssignmentView
