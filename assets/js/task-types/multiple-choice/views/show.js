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

const ShowView = Backbone.View.extend({

    tagName: 'section',

    className: 'cliqr--multiple-choice-show-view',

    render() {
        const template = require('../hbs/multiple-choice-show.hbs')
        this.$el.html(template(decorateTask(this.model)))
        return this
    },

    postRender() {
        const Hub = window.MathJax.Hub
        this.$('.cliqr--mc-description, td.text').each((index, element) => Hub.Queue([ 'Typeset', Hub, element ]))
    }
})

export default ShowView
