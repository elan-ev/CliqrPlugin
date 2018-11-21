import _ from 'underscore'
import Viewmaster from './viewmaster'
import taskTypes from '../models/task_types'

import { toast } from './toast'
import '../../scss/poll.scss'


const createPollView = function(voting) {
    return taskTypes.fetchTaskType(voting.getTask()).then(taskType => taskType.getPollView(voting))
}

const PollsIndexView = Viewmaster.extend({
    events: {
        'click .js-refresh': 'onClickRefresh'
    },

    fresh: null,

    initialize(options) {
        Viewmaster.prototype.initialize.call(this)

        this.listenTo(this.collection, 'newResponse', this.onNewResponse)
        this.listenTo(this.collection, 'add:response', this.update)
        this.update()
    },

    update(polls = null, response = null) {
        this.fresh = this.collection.firstFresh()

        if (response) {
            toast({
                message: 'Erfolgreich abgestimmt',
                type: 'is-success'
            })
        }

        if (this.fresh) {
            createPollView(this.fresh)
                .then(pollView => {
                    this.setView('main', pollView)
                    this.refreshViews()
                    this.render()
                    this.postRender()
                })
                .catch(error => {
                    console.log('Caught an error', error)
                    // TODO
                })
        } else {
            this.clearViews('main')
            this.refreshViews()
            this.render()
            this.postRender()
        }
    },

    template: require('../../hbs/polls_index.hbs'),

    context() {
        return {
            polls: this.collection.toJSON(),
            hasFresh: !!this.fresh
        }
    },

    postRender() {
        const pollViews = this.getViews('main') || []
        pollViews.forEach(view => view.postRender && view.postRender())
    },

    onClickRefresh(event) {
        event.preventDefault()
        window.location.reload(true)
    },

    onNewResponse(response, voting) {
        this.clearViews('main')
        this.refreshViews()
        voting.addResponse(response)
    }
})

export default PollsIndexView
