import _ from 'underscore'
import template from '../../hbs/votings-compare.hbs'
import showError from '../error'
import taskTypes from '../models/task_types'
import Votings from '../models/votings'
import Viewmaster from './viewmaster'

const getView = function(model) {
    return taskTypes.fetchTaskType(model.getTask()).then(taskType => {
        return taskType.getAssignmentView(model)
    })
}

const VotingsCompareView = Viewmaster.extend({
    tagName: 'article',

    className: 'cliqr--votings-compare',

    initialize({ store, votings }) {
        Viewmaster.prototype.initialize.call(this)

        this.votings = new Votings(votings)
        const ids = this.votings.map(voting => voting.id),
            selectors = _.zipObject(ids, ['section.cliqr--voting-side-a main', 'section.cliqr--voting-side-b main'])

        this.listenTo(this.votings, 'change sync', this.render)

        this.listenTo(this.votings, 'sync', voting => {
            const viewSelector = selectors[voting.id]
            getView(voting)
                .then(view => {
                    // trigger navigation event
                    const task = voting.getTask()
                    const taskGroup = store.taskGroups.get(task.get('task_group_id'))
                    store.trigger('navigation', 'task-group', taskGroup)

                    this.setView(viewSelector, view)
                    this.refreshViews()

                    view && view.postRender && view.postRender()

                    return null
                })
                .catch(error => {
                    showError('Could not fetch task type', error)
                })
        })

        this.votings.each(voting => voting.fetch())
    },

    template,

    context() {
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

export default VotingsCompareView
