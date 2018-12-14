import Backbone from 'backbone'
import { View } from 'backbone.marionette'
import template from '../hbs/form.hbs'
import TextInputComponent from './component-text-input'
import WysiwygComponent from '../../../views/component-wysiwyg'
import RangeView from './form-range'
import StatementsView from './form-statements'

export default View.extend({
    tagName: 'section',

    regions: {
        title: '.cliqr--scales-title',
        description: '.cliqr--scales-description',
        statements: {
            el: '.cliqr--scales-statements',
            replaceElement: true
        },
        range: {
            el: 'label.cliqr--scales-range',
            replaceElement: true
        }
    },

    ui: {
        editDescription: '.js-edit',
        cancelCreate: '.js-cancel'
    },

    triggers: {},

    events: {
        'submit form': 'onSubmitForm',
        'click @ui.cancelCreate': 'onClickCancel',
        'click @ui.editDescription': 'onClickEdit'
    },

    initialize({ type, taskGroup }) {
        this.type = type
        this.taskGroup = taskGroup
        this.statements = new Backbone.Collection(this.model.get('task').statements)
    },

    template,

    templateContext() {
        const task = this.model.get('task')

        return {
            taskGroup: this.taskGroup && this.taskGroup.toJSON(),
            task: { ...task, lrange_max: task.hrange_value - 1, hrange_min: task.lrange_value + 1 },
            error: this.model.validationError || null
        }
    },

    onRender() {
        this.showChildView(
            'title',
            new TextInputComponent({
                model: this.model,
                key: 'title'
            })
        )
        this.showChildView(
            'statements',
            new StatementsView({
                collection: this.statements
            })
        )
        this.showChildView(
            'range',
            new RangeView({
                model: this.model
            })
        )
    },

    onClickEdit(event) {
        this.showChildView(
            'description',
            new WysiwygComponent({
                model: this.model,
                key: 'description'
            })
        )
    }
})
