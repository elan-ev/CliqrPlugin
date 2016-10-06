import Backbone from 'backbone'
import _ from 'underscore'

import Viewmaster from '../../views/viewmaster'
import WysiwygComponent from './component-wysiwyg'

const FormView = Viewmaster.extend({

    tagName: 'section',

    events: {
        'click .js-add': 'onClickAdd',
        'click .js-remove': 'onClickRemove',
        'submit form': 'onSubmitForm',
        'click .js-cancel': 'onClickCancel',

        'keypress input.choice': 'onChoiceUpdate',
        'change input.choice': 'onChoiceUpdate',
        'input input.choice': 'onChoiceUpdate'
    },

    initialize(options) {
        Viewmaster.prototype.initialize.call(this)

        this.type = options.type
        this.taskGroup = options.taskGroup

        const wysiwyg = new WysiwygComponent({
            model: this.model,
            key: 'description'
        })

        this.setView('.cliqr--mc-description', wysiwyg)

        this.listenTo(this.model, 'change', this.render)
        this.listenTo(this.model, 'invalid', () => this.render({ force: true }))
    },

    template: require('./multiple-choice-form.hbs'),

    context() {
        return {
            taskGroup: this.taskGroup && this.taskGroup.toJSON(),
            task: this.model.toJSON(),
            error: this.model.validationError || null
        }
    },

    afterTemplate() {
        console.log("rendered")
    },

    onClickAdd(event) {
        event.preventDefault()

        this.model.addAnswer()
    },

    onClickRemove(event) {
        event.preventDefault()

        const index = parseInt(Backbone.$(event.target).closest('.choice-input').find('input[name]').attr('name').match(/\d+/)[0], 10)
        this.model.removeAnswer(index)
    },

    onChoiceUpdate(event) {
        const $inputEl = Backbone.$(event.target),
              index = parseInt($inputEl.attr('name').match(/\d+/)[0], 10),
              text = $inputEl.val()
        this.model.updateAnswer(index, { text })
    }
})

export default FormView
