import Backbone from 'backbone'
import _ from 'underscore'

const decorateTask = function (task) {
    const id = task.get('id')
    return {
        ...task.toJSON(),
        answers: _.map(task.get('task').answers,
                       function (nsr, i) {
                           return {
                               ...nsr,
                               id: `${id}-${i}`,
                               isCorrect: !!nsr.score
                           }}),
        isSingleSelect: task.get('task')['type'] === 'single'
    }
}

const AuthorView = Backbone.View.extend({
    render() {
        const template = require('../../../hbs/task-types/scales-author.hbs')
        this.$el.html(template(decorateTask(this.model)))
        return this
    }
})

export default AuthorView
