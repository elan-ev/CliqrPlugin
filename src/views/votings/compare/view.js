import { View } from 'backbone.marionette'
import Radio from 'backbone.radio'
import taskTypes from '../../../models/task_types'
import template from './compare.hbs'

const getView = function(model) {
    return taskTypes.fetchTaskType(model.getTask()).then(taskType => {
        return taskType.getAssignmentView(model)
    })
}

export default View.extend({
    tagName: 'article',

    className: 'cliqr--votings-compare',

    regions: {
        sideA: 'section.cliqr--voting-side-a main',
        sideB: 'section.cliqr--voting-side-b main'
    },

    initialize({ store, votings: [votingA, votingB] }) {
        this.store = store
        Radio.channel('layout').request('change:pagetitle', 'Abstimmungen vergleichen')

        this.doneLoading = false
        this.votingA = votingA
        this.votingB = votingB
        Promise.all([votingA.fetch(), votingB.fetch()]).then(() => {
            this.triggerMethod('votings:loaded')
        })
    },

    template,

    templateContext() {
        const result = {
            doneLoading: this.doneLoading
        }

        if (this.doneLoading) {
            const taskModel = this.votingA.getTask()
            const task = taskModel.toJSON()

            result['breadcrumb'] = {
                task_group_id: task.task_group_id,
                task_group_title: task.task_group_title,
                task_id: task.id,
                task_title: task.title
            }

            result['votingA'] = this.votingA.toJSON()
            result['votingB'] = this.votingB.toJSON()
        }
        return result
    },

    onRender() {
        if (this.doneLoading) {
            Promise.all([getView(this.votingA), getView(this.votingB)]).then(([sideA, sideB]) => {
                this.showChildView('sideA', sideA)
                this.showChildView('sideB', sideB)
            })
        }
    },

    onVotingsLoaded() {
        this.doneLoading = true

        // trigger navigation event
        const task = this.votingA.getTask()
        const taskGroup = this.store.taskGroups.get(task.get('task_group_id'))
        this.store.trigger('navigation', 'task-group', taskGroup)

        this.render()
    }
})
