import Backbone from 'backbone'
import _ from 'underscore'

import Viewmaster from './viewmaster'
import taskTypes from '../models/task_types'

const createPollView = function (voting) {
    const taskType = taskTypes.getTaskType(voting.getTask())
    return taskType.getPollView(voting).render()
 }

const PollsIndexView = Viewmaster.extend({

    id: 'polls-index',

    events: {
        'click .js-refresh': 'onClickRefresh'
    },

    fresh: null,

    initialize(options) {
        Viewmaster.prototype.initialize.call(this)
        this.listenTo(this.collection, 'newResponse', this.onNewResponse)
        this.listenTo(this.collection, 'all', this.update)
        this.update()
    },

    update(...args) {
        let pollView
        this.fresh = this.collection.firstFresh()

        if (this.fresh) {
            pollView = createPollView(this.fresh)
            this.setView('main', pollView)
        } else {
            this.clearViews('main')
        }

        this.refreshViews()
        this.render()

        if (pollView) {
            pollView.postRender && pollView.postRender()
        }
    },

    template: require('../../hbs/polls_index.hbs'),

    context() {
        return {
            polls: this.collection.toJSON(),
            hasFresh: !!this.fresh
        }
    },

    onClickRefresh(event) {
        event.preventDefault()
        window.location.reload(true)
    },

    onNewResponse(response, voting) {
        voting.addResponse(response)
    }
})

export default PollsIndexView
