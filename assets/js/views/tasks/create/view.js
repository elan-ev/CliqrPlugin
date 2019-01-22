import Radio from 'backbone.radio'
import { View } from 'backbone.marionette'
import Backbone from 'backbone'
import showError from '../../../error'
import TaskCollection from '../../../models/tasks'
import taskTypes from '../../../models/task_types'
import template from './create.hbs'

export default View.extend({
    tagName: 'article',

    className: 'cliqr--tasks-create', // TODO

    $selectedType: null,

    ui: {
        add: '.js-add-question',
        main: 'main'
    },

    events: {
        'click @ui.add': 'onClickAddQuestion'
    },

    regions: {
        mainRegion: '@ui.main'
    },

    initialize({ store }) {
        this.tasks = new TaskCollection(this.model.get('tasks'))
        store.trigger('navigation', 'task-group', this.model)
        Radio.channel('layout').request('change:pagetitle', 'Neue Frage anlegen')
    },

    template,

    templateContext() {
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
            this.render()
            taskTypes
                .fetchTaskType(this.$selectedType)
                .then(taskType => {
                    const view = taskType.getCreateView(this.model)
                    this.listenTo(view, 'newTask', this.onNewTask)
                    this.listenTo(view, 'cancel', this.onCancel)
                    this.showChildView('mainRegion', view)
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
