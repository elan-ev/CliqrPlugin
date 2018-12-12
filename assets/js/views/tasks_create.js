import Backbone from 'backbone'
import template from '../../hbs/tasks-create.hbs'
import showError from '../error'
import TaskCollection from '../models/tasks'
import taskTypes from '../models/task_types'
import Viewmaster from './viewmaster'

const TasksCreateView = Viewmaster.extend({
    tagName: 'article',

    className: 'cliqr--tasks-create', // TODO

    $selectedType: null,

    events: {
        'click .js-add-question': 'onClickAddQuestion'
    },

    initialize({ store }) {
        Viewmaster.prototype.initialize.call(this)

        this.tasks = new TaskCollection(this.model.get('tasks'))
        store.trigger('navigation', 'task-group', this.model)
    },

    template,

    context() {
        return {
            STUDIP: window.STUDIP,
            $selectedType: this.$selectedType,
            taskTypes: taskTypes.map(t => {
                return { ...t.toJSON(), selected: t.id === this.$selectedType }
            }),
            breadcrumb: {
                task_group_id: this.model.id,
                task_group_title: this.model.get('title')
            }
        }
    },

    selectTypeCreator(id) {
        if (this.$selectedType !== id) {
            this.$selectedType = id

            taskTypes
                .fetchTaskType(this.$selectedType)
                .then(taskType => {
                    const oldViews = this.getViews('main')
                    if (oldViews) {
                        oldViews.forEach(v => this.stopListening(v))
                    }

                    const view = taskType.getCreateView(this.model)
                    this.listenTo(view, 'newTask', this.onNewTask)
                    this.listenTo(view, 'cancel', this.onCancel)
                    this.setView('main', view)
                    this.render()
                    view && view.postRender && view.postRender()

                    return null
                })
                .catch(error => {
                    showError('Could not fetch task type', error)
                })
        }
    },

    onNewTask(task) {
        this.tasks.create(
            { ...task.attributes, task_group_id: this.model.id },
            {
                success(task) {
                    Backbone.history.navigate(`task/show/${task.id}`, { trigger: true })
                    return null
                }
            }
        )
    },

    onCancel() {
        Backbone.history.navigate(`task-groups/show/${this.model.id}`, { trigger: true })
    },

    onClickAddQuestion(event) {
        event.preventDefault()

        const id = Backbone.$(event.target)
            .closest('.js-add-question')
            .data('typeid')

        this.selectTypeCreator(id)
    }
})

export default TasksCreateView
