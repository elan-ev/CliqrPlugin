import Backbone from 'backbone'
import _ from 'underscore'

const decorateTaskGroup = function (taskGroup) {
    const id = taskGroup.get('id')
    return {
        ...taskGroup.toJSON()
    }
}

const CreateView = Backbone.View.extend({

    className: 'cliqr--multiple-choice-create-view',

    events: {
        'click .js-add': 'onClickAdd',
        'click .js-remove': 'onClickRemove',
        'submit form': 'onSubmitForm',

        'keypress #task-description': 'onDescriptionUpdate',
        'change #task-description': 'onDescriptionUpdate',
        'input #task-description': 'onDescriptionUpdate',

        'keypress input.choice': 'onChoiceUpdate',
        'change input.choice': 'onChoiceUpdate',
        'input input.choice': 'onChoiceUpdate'
    },

    initialize(options) {
        this.type = options.type
        this.taskGroup = options.taskGroup
        this.listenTo(this.model, 'change', this.render)

        this.listenTo(this.model, 'change', (model) => {
            console.log("model changed:", model)
        })
    },

    render() {
        const template = require('./multiple-choice-create.hbs')
        this.$el.html(template({
            taskGroup: decorateTaskGroup(this.taskGroup),
            task: this.model.toJSON()
        }))
        return this
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

    onDescriptionUpdate(event) {
        const description = Backbone.$(event.target).val()
        this.model.set({ description }, { silent: true })
    },

    onChoiceUpdate(event) {
        const $inputEl = Backbone.$(event.target),
              index = parseInt($inputEl.attr('name').match(/\d+/)[0], 10),
              text = $inputEl.val()
        this.model.updateAnswer(index, { text })
    },

    onSubmitForm(event) {
        event.preventDefault()
        this.taskGroup.trigger('newTask', this.model)
    }
})

export default CreateView
