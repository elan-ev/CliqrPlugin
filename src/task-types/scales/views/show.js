import Backbone from 'backbone'
import Radio from 'backbone.radio'
import { View } from 'backbone.marionette'
import TaskEditComponent from '../../../components/component-task-edit'
import template from '../hbs/show.hbs'
import StatementsView from './show-statements'

export default View.extend({
    tagName: 'section',
    className: 'cliqr--scales-show-view',

    regions: {
        editButton: 'span.cliqr--component-task-edit',
        statements: 'main'
    },

    initialize() {
        this.statements = new Backbone.Collection(this.model.get('task').statements)
    },

    template,

    onRender() {
        this.showChildView(
            'editButton',
            new TaskEditComponent({
                model: this.model
            })
        )
        const statements = new StatementsView({
            collection: this.statements
        })
        this.showChildView('statements', statements)
    },

    onAttach() {
        Radio.channel('layout').request('apply:mathjax', this.$('.cliqr--scales-description').eq(0))
    }
})
