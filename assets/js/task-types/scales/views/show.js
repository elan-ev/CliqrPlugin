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

        this.setView('article.studip header', edit)
    },

    template: require('../hbs/show.hbs'),

    context() {
        return decorateTask(this.model)
    },

    postRender() {
        const Hub = window.MathJax.Hub
        this.$('.cliqr--scales-description, td.text').each((index, element) => Hub.Queue([ 'Typeset', Hub, element ]))
    }
})

export default ShowView
