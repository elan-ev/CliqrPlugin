import Backbone from 'backbone'
import _ from 'underscore'

import Viewmaster from '../../../views/viewmaster'
import WysiwygComponent from './component-wysiwyg'

const subtypes = [
    { id: 'custom', text: 'Individuell' },
    { id: 'yesno', text: 'Ja·Nein' },
    { id: 'truefalse', text: 'Wahr·Falsch' }
]

const FormView = Viewmaster.extend({

    tagName: 'section',

    $selectedSubtype: 'custom',
    $customChoices: null,

    events: {
        'click .js-add': 'onClickAdd',
        'click .js-remove': 'onClickRemove',
        'submit form': 'onSubmitForm',
        'click .js-cancel': 'onClickCancel',

        'keypress input.choice': 'onChoiceUpdate',
        'change input.choice': 'onChoiceUpdate',
        'input input.choice': 'onChoiceUpdate',

        'change input[name="select-type"]': 'onChangeMultiSingle',

        'click .cliqr--mc-subtypes button': 'onSelectSubtype'
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

    template: require('../hbs/multiple-choice-form.hbs'),

    context() {
        return {
            taskGroup: this.taskGroup && this.taskGroup.toJSON(),
            task: this.model.toJSON(),
            error: this.model.validationError || null,
            singleSelect: this.model.getSelectType() === 'single',
            $selectedSubtype: this.$selectedSubtype,
            subtypes: subtypes.map(subtype => {
                return { ...subtype, selected: subtype.id === this.$selectedSubtype }
            })
        }
    },

    afterTemplate() {
        // console.log("rendered")
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
    },

    onChangeMultiSingle({ target }) {
        const type = Backbone.$(target).prop('checked') ? 'multiple' : 'single'
        this.model.setSelectType(type)
    },

    onSelectSubtype({ target }) {
        const classSubtype = [...target.classList].filter(item => item.match(/^js-type-/))
        if (!classSubtype.length) {
            return
        }
        const subtype = classSubtype[0].substr(8)
        if (subtypes.some(type => type.id === subtype)) {
            this.selectSubtype(subtype)
        }
    },

    selectSubtype(newSubtype) {
        const oldSubtype = this.$selectedSubtype

        if (newSubtype === oldSubtype) {
            return
        }

        this.$selectedSubtype = newSubtype

        if (oldSubtype === 'custom') {
            // store custom choices
            this.$customChoices = this.model.getAnswers()
        }

        switch (newSubtype) {

        case 'custom':
            this.model.setAnswers(this.$customChoices)
            break;

        case 'yesno':
            this.model.clearAnswers()
            this.model.addAnswer({ text: 'ja'})
            this.model.addAnswer({ text: 'nein'})
            break;

        case 'truefalse':
            this.model.clearAnswers()
            this.model.addAnswer({ text: 'wahr'})
            this.model.addAnswer({ text: 'falsch'})
            break;
        }

        this.render()
    }
})

export default FormView
