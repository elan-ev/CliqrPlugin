import Backbone from 'backbone'
import _ from 'underscore'
import utils from '../utils'

const decorateTask = function (task, voting = null) {
    const id = task.get('id'),
          votes = tallyVotes(task, voting)
    return {
        ...task.toJSON(),
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

class MultipleChoice {
    constructor(task) {
        this.task = task
    }

    renderAuthor() {
        const template = require('../../hbs/task-types/multiple-choice-author.hbs')
        return template(decorateTask(this.task))
    }

    renderVoting(voting) {
        const template = require('../../hbs/task-types/multiple-choice-voting.hbs')
        return template({
            ...decorateTask(this.task, voting),
            voting: voting.toJSON()
        })
    }
}

export default MultipleChoice
