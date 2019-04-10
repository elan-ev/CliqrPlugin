import { View } from 'backbone.marionette'
import Radio from 'backbone.radio'
import TaskEditComponent from '../../../components/component-task-edit'
import template from '../hbs/show.hbs'

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
        return {
            answers: this.model.get('task').answers,
            isSingleSelect: this.model.get('task')['type'] === 'single'
        }
    },

    onRender() {
        this.showChildView(
            'headerRegion',
            new TaskEditComponent({
                model: this.model
            })
        )
    },

    onAttach() {
        Radio.channel('layout').request('apply:mathjax', this.$('.cliqr--mc-description, td.text, span.math-tex:not(:has(.MathJax))'))
    }
})
