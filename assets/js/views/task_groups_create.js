import Backbone from 'backbone'
import _ from 'underscore'

const TaskGroupsCreateView = Backbone.View.extend({

    tagName: 'article',

    className: 'cliqr--task-groups-create',

    events: {
        'click .js-create': 'onClickCreate',
        'click .js-cancel': 'onClickCancel'
    },

    render() {
        const template = require('../../hbs/task-groups-create.hbs')
        this.$el.html(template(this.collection.toJSON()))
        return this
    },

    onClickCreate(event) {
        event.preventDefault()
        const $formData = Backbone.$(event.target.closest('form')).serializeArray(),
              formData = _.reduce(
                  $formData,
                  (memo, item) => _.tap(memo, (memo) => memo[item.name] = item.value),
                  {})
        this.collection.create(formData, {
            success: (args) => {
                this.trigger('cancel', event, this)
            }
        })
    },

    onClickCancel(event) {
        event.preventDefault()
        this.trigger('cancel', event, this)
    }
})

export default TaskGroupsCreateView
