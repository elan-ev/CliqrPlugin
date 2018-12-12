import template from '../../hbs/task-groups-show.hbs'
import TaskCollection from '../models/tasks'
import TaskListView from './task_list'
import Viewmaster from './viewmaster'

const TaskGroupsShowView = Viewmaster.extend({
    className: 'task-groups-show',

    tasks: null,

    initialize({ store }) {
        Viewmaster.prototype.initialize.call(this)

        this.tasks = new TaskCollection(this.model.get('tasks'))
        this.setView('.task-list-container', new TaskListView({ collection: this.tasks, model: this.model }))

        store.trigger('navigation', 'task-group', this.model)
    },

    template,

    context() {
        return this.model.toJSON()
    },

    postRender() {
        this.eachView((sel, v) => {
            v && v.postRender && v.postRender()
        })
    }
})

export default TaskGroupsShowView
