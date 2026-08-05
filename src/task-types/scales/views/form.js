import Backbone from 'backbone';
import { View } from 'backbone.marionette';
import Radio from 'backbone.radio';
import WysiwygComponent from '../../../components/component-wysiwyg.js';
import template from '../hbs/form.hbs';
import TextInputComponent from './component-text-input.js';
import InputTypeView from './form-input-type.js';
import RangeView from './form-range.js';
import StatementsView from './form-statements.js';

export default View.extend({
    tagName: 'section',

    regions: {
        title: '.cliqr--scales-title',
        description: '.cliqr--scales-description',
        statements: {
            el: '.cliqr--scales-statements',
            replaceElement: true,
        },
        range: {
            el: 'label.cliqr--scales-range',
            replaceElement: true,
        },
        inputType: {
            el: 'label.cliqr--scales-input-type',
            replaceElement: true,
        },
    },

    ui: {
        editDescription: '.js-edit',
        cancelCreate: '.js-cancel',
    },

    events: {
        'submit form': 'onSubmitForm',
        'click @ui.cancelCreate': 'onClickCancel',
        'click @ui.editDescription': 'onClickEdit',
    },

    modelEvents: {
        invalid: 'onInvalid',
    },

    childViewTriggers: {
        'add:statement': 'add:statement',
        'remove:statement': 'remove:statement',
    },

    initialize({ type, taskGroup }) {
        this.type = type;
        this.taskGroup = taskGroup;
        this.statements = new Backbone.Collection(this.model.get('task').statements);
    },

    template,

    templateContext() {
        return {
            error: this.model.validationError || null,
        };
    },

    onRender() {
        this.showChildView(
            'title',
            new TextInputComponent({
                model: this.model,
                key: 'title',
            }),
        );
        this.showChildView(
            'statements',
            new StatementsView({
                collection: this.statements,
            }),
        );
        this.showChildView(
            'range',
            new RangeView({
                model: this.model,
            }),
        );
        this.showChildView(
            'inputType',
            new InputTypeView({
                model: this.model,
            }),
        );
    },

    onClickEdit(event) {
        this.showChildView(
            'description',
            new WysiwygComponent({
                model: this.model,
                key: 'description',
            }),
        );
    },

    onAddStatement(view, event) {
        this.statements.add({ text: '' });
    },

    onRemoveStatement(view, event) {
        this.statements.remove(view.model);
    },

    onInvalid() {
        this.render();
        Radio.channel('layout').request('scroll:top');
    },
});