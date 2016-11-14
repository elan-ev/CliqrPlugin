import Backbone from 'backbone'

import Viewmaster from '../../../views/viewmaster'
import WysiwygComponent from './component-wysiwyg'

const decorateTask = function (model) {
    const task = { ...model.get('task') }
    task.lrange_max = task.hrange_value - 1
    task.hrange_min = task.lrange_value + 1

    return { ...model.toJSON(), task }
}

const FormView = Viewmaster.extend({

    tagName: 'section',

    events: {
        'click .js-add': 'onClickAdd',
        'click .js-remove': 'onClickRemove',
        'submit form': 'onSubmitForm',
        'click .js-cancel': 'onClickCancel',

        'keypress input.choice': 'onChoiceUpdate',
        'change input.choice': 'onChoiceUpdate',
        'input input.choice': 'onChoiceUpdate',

        'change .cliqr--scales-lrange': 'onLRangeUpdate',
        'change .cliqr--scales-hrange': 'onHRangeUpdate',

        'keypress .cliqr--scales-llabel, .cliqr--scales-hlabel': 'onLabelChange',
        'change .cliqr--scales-llabel, .cliqr--scales-hlabel': 'onLabelChange',
        'input .cliqr--scales-llabel, .cliqr--scales-hlabel': 'onLabelChange'
    },

    initialize(options) {
        Viewmaster.prototype.initialize.call(this)

        this.type = options.type
        this.taskGroup = options.taskGroup

        const wysiwyg = new WysiwygComponent({
            model: this.model,
            key: 'description'
        })

        this.setView('.cliqr--scales-description', wysiwyg)

        this.listenTo(this.model, 'change', this.render)
        this.listenTo(this.model, 'invalid', () => this.render({ force: true }))
    },

    template: require('../hbs/form.hbs'),

    context() {
        return {
            taskGroup: this.taskGroup && this.taskGroup.toJSON(),
            task: decorateTask(this.model),
            error: this.model.validationError || null
        }
    },

    onClickAdd(event) {
        event.preventDefault()

        this.model.addStatement()
    },

    onClickRemove(event) {
        event.preventDefault()

        const index = parseInt(Backbone.$(event.target).closest('.choice-input').find('input[name]').attr('name').match(/\d+/)[0], 10)
        this.model.removeStatement(index)
    },

    onChoiceUpdate(event) {
        const $inputEl = Backbone.$(event.target),
              index = parseInt($inputEl.attr('name').match(/\d+/)[0], 10),
              text = $inputEl.val()
        this.model.updateStatement(index, { text })
    },

    onLRangeUpdate(event) {
        let lrange = parseInt(this.$('.cliqr--scales-lrange').val(), 10)
        const hrange = parseInt(this.$('.cliqr--scales-hrange').val(), 10)

        if (lrange >= hrange) {
            lrange = hrange - 1
        }

        this.model.setLRange(lrange)
    },

    onHRangeUpdate(event) {
        const lrange = parseInt(this.$('.cliqr--scales-lrange').val(), 10)
        let hrange = parseInt(this.$('.cliqr--scales-hrange').val(), 10)

        if (hrange.toString().length > 7) {
            hrange = parseInt(hrange.toString().substring(0, 6), 10)
        }

        if (lrange >= hrange) {
            hrange = lrange + 1
        }

        this.model.setHRange(hrange)
    },

    onLabelChange(event) {
        const llabel = this.$('.cliqr--scales-llabel').val(),
              hlabel = this.$('.cliqr--scales-hlabel').val()

        this.model.setDimensions(llabel, hlabel)
    }
})

export default FormView
