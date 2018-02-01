import Backbone from 'backbone'
import _ from 'underscore'

import Viewmaster from '../../../views/viewmaster'
import WysiwygComponent from './component-wysiwyg'

const subtypes = [
    { id: 'custom', text: 'Individuell' },
    { id: 'yesno', text: 'Ja·Nein' },
    { id: 'truefalse', text: 'Wahr·Falsch' },
    { id: 'evaluation', text: 'Evaluation' },
    { id: 'grading', text: 'Benotung' }
]

const FormView = Viewmaster.extend({

    tagName: 'section',

    $selectedSubtype: 'custom',
    $custom: null,

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
            this.$custom = { ...this.model.attributes }
        }

        switch (newSubtype) {

        case 'custom':
            this.model.set({ ...this.$custom })
            break;

        case 'yesno':
            this.fillWithSubtype(['ja', 'nein'])
            break;

        case 'truefalse':
            this.fillWithSubtype(['wahr', 'falsch'])
            break;

        case 'evaluation':
            this.fillWithSubtype(['trifft voll zu', 'trifft eher zu', 'weder noch', 'trifft eher nicht zu', 'trifft gar nicht zu'])
            break;

        case 'grading':
            this.fillWithSubtype([ 'sehr gut', 'gut', 'befriedigend', 'ausreichend', 'mangelhaft', 'ungenügend' ])
            break
        }

        this.render()
    },

    fillWithSubtype(choices) {
        this.model.clearAnswers()
        this.model.setSelectType('single')
        choices.forEach(text => this.model.addAnswer({ text }))
    }
})

export default FormView
