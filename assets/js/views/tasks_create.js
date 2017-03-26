import Backbone from 'backbone'

import Viewmaster from './viewmaster'
import taskTypes from '../models/task_types'
import TaskCollection from '../models/tasks'

const TasksCreateView = Viewmaster.extend({

    tagName: 'article',

    className: 'cliqr--tasks-create', // TODO

    $selectedType: null,

    events: {
        'click .js-show-chooser': 'onClickShowChooser',
        'click .js-add-question': 'onClickAddQuestion'
    },

    template: require('../../hbs/tasks-create.hbs'),

    initialize(options) {
        Viewmaster.prototype.initialize.call(this)

        this.tasks = new TaskCollection(this.model.get('test').tasks)
    },

    context() {
        const { task_group_id, task_group_title } = this.model.toJSON()

        return {
            STUDIP: window.STUDIP,
            $selectedType: this.$selectedType,
            taskTypes: taskTypes.map(t => {
                return { ...t.toJSON(), selected: t.id === this.$selectedType }
            }),
            breadcrumb: { task_group_id, task_group_title }
        }
    },

    selectTypeCreator(id) {
        if (this.$selectedType !== id) {
            this.$selectedType = id

            taskTypes.fetchTaskType(this.$selectedType)
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
        }
    },


    onNewTask(task) {
        this.tasks.create({ ...task.attributes, task_group_id: this.model.id }, {
            success(task) {
                Backbone.history.navigate(`task/show/${task.id}`, { trigger: true })
                return null
            }
        })
    },

    onCancel() {
        Backbone.history.navigate(`task-groups/show/${this.model.id}`, { trigger: true })
    },

    onClickShowChooser(event) {
        event.preventDefault()

        this.render()
    },

    onClickAddQuestion(event) {
        event.preventDefault()

        const id = Backbone.$(event.target).closest('.js-add-question').data('typeid')
        this.selectTypeCreator(id)
    }
})

export default TasksCreateView
