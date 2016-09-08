import Backbone from 'backbone'
import _ from 'underscore'

const decorateTask = function (task, voting = null) {
    const id = task.get('id'),
          votes = tallyVotes(task, voting)
    return {
        ...task.toJSON(),
        ...voting,
        answers: _.map(task.get('task').answers,
                       function (nsr, i) {
                           return {
                               ...nsr,
                               id: `${id}-${i}`,
                               isCorrect: !!nsr.score,
                               votes: votes[i]
                           }}),
        isSingleSelect: task.get('task')['type'] === 'single'
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

const AuthorView = Backbone.View.extend({
    initialize(options) {
        this.voting = options.voting
    },

    render() {
        const template = require('./scales-assignment.hbs')
        this.$el.html(template(decorateTask(this.model, this.voting)))
        return this
    }
})

export default AuthorView
