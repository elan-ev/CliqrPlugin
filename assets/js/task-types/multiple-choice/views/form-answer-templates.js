import { View } from 'backbone.marionette'
import _ from 'underscore'
import template from '../hbs/form-answer-templates.hbs'

const subtypes = [
    { id: 'custom', text: 'Individuell' },
    { id: 'yesno', text: 'Ja·Nein' },
    { id: 'truefalse', text: 'Wahr·Falsch' },
    { id: 'evaluation', text: 'Evaluation' },
    { id: 'grading', text: 'Benotung' }
]

export default View.extend({
    className: 'cliqr--mc-answer-templates',
    template,

    templateContext() {
        const selected = this.model.get('selected')
        return {
            subtypes: subtypes.map(subtype => ({ ...subtype, selected: subtype.id === selected }))
        }
    },

    events: {
        'click .cliqr--mc-subtypes button': 'onClickSubtype'
    },

    modelEvents: {
        change: 'render'
    },

    onClickSubtype({ target }) {
        const classSubtype = [...target.classList].filter(item => item.match(/^js-type-/))
        if (!classSubtype.length) {
            return
        }
        const subtype = classSubtype[0].substr(8)

        if (_.some(subtypes, type => type.id === subtype)) {
            this.triggerMethod('select:subtype', subtype)
        }
    }
})
