import { View } from 'backbone.marionette'
import _ from 'underscore'
import showError from '../../../error'
import taskTypes from '../../../models/task_types'
import Votings from '../../../models/votings'
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

    initialize({ store, votings }) {
        this.votings = new Votings(votings)
        const ids = this.votings.map(voting => voting.id),
            selectors = _.zipObject(ids, ['sideA', 'sideB'])

        this.listenTo(this.votings, 'change sync', this.render)

        this.listenTo(this.votings, 'sync', voting => {
            const viewSelector = selectors[voting.id]
            getView(voting)
                .then(view => {
                    // trigger navigation event
                    const task = voting.getTask()
                    const taskGroup = store.taskGroups.get(task.get('task_group_id'))
                    store.trigger('navigation', 'task-group', taskGroup)

                    this.showChildView(viewSelector, view)
                })
                .catch(error => {
                    showError('Could not fetch task type', error)
                })
        })

        this.votings.each(voting => voting.fetch())
    },

    template,

    templateContext() {
        const votingA = this.votings.first(),
            votingB = this.votings.last(),
            taskModel = votingA && votingA.getTask(),
            task = taskModel && taskModel.toJSON(),
            breadcrumb = task && {
                task_group_id: task.task_group_id,
                task_group_title: task.task_group_title,
                task_id: task.id,
                task_title: task.title
            }

        return {
            votingA: votingA.toJSON(),
            votingB: votingB.toJSON(),
            task,
            breadcrumb
        }
    }
})
