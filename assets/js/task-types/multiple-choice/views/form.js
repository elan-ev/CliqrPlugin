import Backbone from 'backbone'
import { View } from 'backbone.marionette'
import template from '../hbs/form.hbs'
import TextInputComponent from './component-text-input'
import WysiwygComponent from '../../../views/component-wysiwyg'
import AnswerTemplatesComponent from './form-answer-templates'
import ChoicesComponent from './form-choices'
import OptionsComponent from './form-options'

export default View.extend({
    tagName: 'section',

    regions: {
        title: '.cliqr--mc-title',
        description: '.cliqr--mc-description',
        answerTemplates: { el: '.cliqr--mc-answer-templates', replaceElement: true },
        choices: { el: '.cliqr--mc-choices', replaceElement: true },
        options: { el: '.cliqr--multiple-choice-options div', replaceElement: true }
    },

    ui: {
        cancel: '.js-cancel'
    },

    events: {
        'click @ui.cancel': 'onClickCancel',
        'submit form': 'onSubmitForm'
    },

    modelEvents: {
        invalid: 'render'
    },

    childViewEventPrefix: 'childview',

    childViewTriggers: {
        'add:choice': 'add:choice',
        'remove:choice': 'remove:choice'
    },


    initialize({ type, taskGroup }) {
        this.type = type
        this.taskGroup = taskGroup
        this.subtype = new Backbone.Model({ selected: 'custom', custom: null })
        this.choices = new Backbone.Collection(this.model.get('task').answers)

        this.listenTo(this.choices, 'all', console.log)
    },

    template,

    templateContext() {
        return {
            error: this.model.validationError || null
        }
    },

    onRender() {
        this.showChildView(
            'title',
            new TextInputComponent({
                model: this.model,
                key: 'title',
                placeholderKey: 'description'
            })
        )
        this.showChildView(
            'description',
            new WysiwygComponent({
                model: this.model,
                key: 'description'
            })
        )
        this.showChildView('choices', new ChoicesComponent({ collection: this.choices }))
        this.showChildView(
            'answerTemplates',
            new AnswerTemplatesComponent({
                model: this.subtype
            })
        )
        this.showChildView('options', new OptionsComponent({ model: this.model }))
    },

    onChildviewSelectSubtype(newSubtype) {
        const oldSubtype = this.subtype.get('selected')

        if (newSubtype === oldSubtype) {
            return
        }

        this.subtype.set('selected', newSubtype)

        if (oldSubtype === 'custom') {
            this.subtype.set('custom', { model: this.model.toJSON(), choices: this.choices.toJSON() })
        }

        switch (newSubtype) {
            case 'custom':
                const { model, choices } = this.subtype.get('custom')
                this.model.set(model)
                this.choices.reset(choices)
                break

            case 'yesno':
                this.fillWithSubtype(['ja', 'nein'])
                break

            case 'truefalse':
                this.fillWithSubtype(['wahr', 'falsch'])
                break

            case 'evaluation':
                this.fillWithSubtype([
                    'trifft voll zu',
                    'trifft eher zu',
                    'weder noch',
                    'trifft eher nicht zu',
                    'trifft gar nicht zu'
                ])
                break

            case 'grading':
                this.fillWithSubtype(['sehr gut', 'gut', 'befriedigend', 'ausreichend', 'mangelhaft', 'ungenügend'])
                break
        }
    },

    fillWithSubtype(choices) {
        this.choices.reset(choices.map(text => ({ text, score: 0, feedback: '' })))
        this.model.setSelectType('single')
    },

    onAddChoice(view, event) {
        event.preventDefault()
        this.choices.add({
            text: '',
            score: 0,
            feedback: ''
        })
    },

    onRemoveChoice({ model }, event) {
        event.preventDefault()
        this.choices.remove(model)
    }
})
