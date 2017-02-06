import Viewmaster from './viewmaster'

const TaskGroupsCreateView = Viewmaster.extend({

    tagName: 'article',

    className: 'cliqr--task-groups-create',

    events: {
        'submit form': 'onClickCreate',
        'click .js-cancel': 'onClickCancel'
    },

    initialize() {
        Viewmaster.prototype.initialize.call(this)
    },

    template: require('../../hbs/task-groups-create.hbs'),

    onClickCreate(event) {
        event.preventDefault()

        const title = this.$('form')[0].title.value.trim()

        if (!title.length) {
            return
        }

        this.collection.create({ title }, { success: () => { this.trigger('cancel', event, this) } })
    },

    onClickCancel(event) {
        event.preventDefault()
        this.trigger('cancel', event, this)
    }
})

export default TaskGroupsCreateView
