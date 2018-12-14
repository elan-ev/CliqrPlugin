import { View } from 'backbone.marionette'
import _ from 'underscore'
import TaskEditComponent from '../../../views/component-task-edit'
import template from '../hbs/show.hbs'

const decorateTask = function(task) {
    const id = task.get('id')
    return {
        answers: _.map(task.get('task').answers, function(nsr, i) {
            return {
                ...nsr,
                id: `${id}-${i}`,
                isCorrect: !!nsr.score
            }
        }),
        isSingleSelect: task.get('task')['type'] === 'single'
    }
}

export default View.extend({
    tagName: 'section',
    className: 'cliqr--multiple-choice-show-view',

    ui: {
        header: 'article.studip header nav'
    },

    regions: {
        headerRegion: {
            el: '@ui.header',
            replaceElement: true
        }
    },

    template,

    templateContext() {
        return decorateTask(this.model)
    },

    onRender() {
        const edit = new TaskEditComponent({
            model: this.model
        })

        this.showChildView('headerRegion', edit)
    },

    onAttach() {
        const Hub = window.MathJax.Hub
        this.$('.cliqr--mc-description, td.text').each((index, element) => Hub.Queue(['Typeset', Hub, element]))
    }
})
