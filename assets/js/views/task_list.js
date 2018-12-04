import Backbone from 'backbone'
import Viewmaster from './viewmaster'
import TaskListItemView from './task_list_item'
import showError from '../error'

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
        const tbody = this.$('.cliqr--task-list'),
              model = this.model

        if (!tbody.sortable('instance')) {
            tbody.sortable(
                {
                    handle: '.cliqr--task-checkbox',
                    items: 'tbody tr',
                    cursor: 'ns-resize',
                    opacity: 1,
                    update() {
                        const positions = Backbone.$(this)
                              .sortable('toArray', { attribute: 'data-taskid' })
                              .map(item => parseInt(item, 10))

                        model
                            .reorder(positions)
                            .catch((...attrs) => showError('Die Sortierung konnte nicht gespeichert werden.', attrs))
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
