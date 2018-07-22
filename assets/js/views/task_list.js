import Viewmaster from './viewmaster'
import TaskListItemView from './task_list_item'

const TaskListView = Viewmaster.extend({

    className: 'cliqr--task-list',

    initialize() {
        Viewmaster.prototype.initialize.call(this)

        this.listenTo(this.collection, 'add', this.onTaskAdded)
        this.listenTo(this.collection, 'remove', this.onTaskRemoved)

        this.collection.each(this.appendItem, this)
    },

    template: require('../../hbs/task-list.hbs'),

    context() {
        return {
            taskGroup: this.model.toJSON(),
            tasks: this.collection.toJSON()
        }
    },

    postRender() {
        const tbody = this.$('.cliqr--task-list')

        if (!tbody.sortable('instance')) {
            tbody.sortable(
                {
                    handle: '.cliqr--task-checkbox',
                    items: 'tbody tr',
                    cursor: 'move',
                    opacity: 1,
                    // activate() { console.log('activate', arguments) },
                    // beforeStop() { console.log('beforeStop', arguments) },
                    // change() { console.log('change', arguments) },
                    // create() { console.log('create', arguments) },
                    // deactivate() { console.log('deactivate', arguments) },
                    // out() { console.log('out', arguments) },
                    // over() { console.log('over', arguments) },
                    // receive() { console.log('receive', arguments) },
                    // remove() { console.log('remove', arguments) },
                    // sort() { console.log('sort', arguments) },
                    // start() { console.log('start', arguments) },
                    // stop() { console.log('stop', arguments) },

                    update(event, ui) {
                        console.log('update', arguments)
                    }
                }
            ).disableSelection()
        }
    },

    appendItem(model) {
        this.appendView('.cliqr--task-list tbody', new TaskListItemView({ model }))
    },

    onTaskAdded(model) {
        this.appendItem(model)
        this.refreshViews()
    },

    onTaskRemoved(model) {
//        this.refreshViews()
    }
})

export default TaskListView
