import Viewmaster from '../../../views/viewmaster'
import TaskEditComponent from '../../../views/component-task-edit'

const decorateTask = function (task) {
    return task.toJSON()
}

const ShowView = Viewmaster.extend({

    tagName: 'section',
    className: 'cliqr--scales-show-view',


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
        this.$('.cliqr--scales-description, td.text').each((index, element) => Hub.Queue([ 'Typeset', Hub, element ]))

        const { lrange_value, hrange_value } = this.model.get('task')
        const value = Math.floor(0.382 * (hrange_value + lrange_value))

        this.$('.cliqr--scales-slider').slider({
            min: lrange_value,
            max: hrange_value,
            value
        })
    }
})

export default ShowView
