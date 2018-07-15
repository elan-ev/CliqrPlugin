import _ from 'underscore'
import Viewmaster from '../../../views/viewmaster'
import TaskEditComponent from '../../../views/component-task-edit'

const decorateTask = function (task) {
    const id = task.get('id')
    return {
        task: task.toJSON(),
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

const ShowView = Viewmaster.extend({

    tagName: 'section',
    className: 'cliqr--multiple-choice-show-view',

    initialize() {
        Viewmaster.prototype.initialize.call(this)

        const edit = new TaskEditComponent({
            model: this.model
        })

        this.setView('.contentbox header', edit)
    },

    template: require('../hbs/show.hbs'),

    context() {
        return decorateTask(this.model)
    },

    postRender() {
        const Hub = window.MathJax.Hub
        this.$('.cliqr--mc-description, td.text').each((index, element) => Hub.Queue([ 'Typeset', Hub, element ]))
    }
})

export default ShowView
