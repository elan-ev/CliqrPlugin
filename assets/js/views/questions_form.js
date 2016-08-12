import Backbone from 'backbone'
import utils from '../utils'
import Handlebars from 'handlebars'
import TemplateView from './template_view'

const disableSaveButton = function (form) {
    const button = form.find('button[name=save]');
    if (button.length) {
        button.prop('disabled', true).showAjaxNotification();
    }
}

const QuestionsForm = TemplateView.extend({

    template_id: 'questions-form',
    className: 'questions-form',
    events: {
        'click .choice-new': 'addChoice',
        'click .close': 'removeChoice',
        'keydown input.choice': 'enhanceChoiceInput',
        'submit form': 'submitForm'
    },

    initialize() {
        if (!Handlebars.partials['choice']) {
            Handlebars.registerPartial('choice', utils.compileTemplate('questions-choice'))
        }
    },

    render() {
        this.$el.html(this.template(this.model ? this.model.toJSON() : {}))
        this.$('form').validator()
        return this
    },

    postRender() {
        return this.$('textarea').elastic()
    },

    addChoice(event) {
        const choice = Handlebars.partials['choice']({});
        return Backbone.$(choice).insertBefore(this.$('.choice-new')).find('input')[0].focus()
    },

    removeChoice(event) {
        const choice_input = Backbone.$(event.target).closest('.choice-input')
        if (choice_input.siblings('.choice-input').length) {
            return choice_input.remove()
        } else {
            return choice_input.effect('shake', 50)
        }
    },

    enhanceChoiceInput(event) {
        let inputs, last, index, form_inputs

        if (event.which === 13 || event.which === 38 || event.which === 40) {
            inputs = this.$('.choices input')
            last = inputs.length - 1
            index = inputs.index(event.target)
            if (event.which === 13 || event.which === 40) {
                if (last === index) {
                    this.addChoice()
                } else {
                    inputs[index + 1].focus()
                }
                event.preventDefault()
            }
            if (event.which === 38) {
                form_inputs = this.$('.choices input')
                index = Math.max(0, form_inputs.index(event.target) - 1)
                form_inputs.eq(index).focus()
                event.preventDefault()
            }
        }
    },

    submitForm(event) {
        event.preventDefault()

        const form = this.$('form')
        if (!form.data('validator').checkValidity()) {
            return
        }

        disableSaveButton(form)

        const action = 'questions/' + (this.model ? 'update/' + this.model.id : 'create')
        const url = '' + cliqr.config.PLUGIN_URL + action + '?cid=' + cliqr.config.CID
        Backbone.$.post(url, form.serialize()).done(function(msg) {
            Backbone.history.navigate('show-' + msg.id, { trigger: true });
        }).fail(function() {
            console.log('TODO fail', arguments);
        })
    }
})

export default QuestionsForm
