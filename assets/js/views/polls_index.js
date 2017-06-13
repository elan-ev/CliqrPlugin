import _ from 'underscore'
import Viewmaster from './viewmaster'
import taskTypes from '../models/task_types'

const createPollView = function (voting) {
    return taskTypes.fetchTaskType(voting.getTask())
        .then(taskType => taskType.getPollView(voting))
}

const PollsIndexView = Viewmaster.extend({

    id: 'polls-index',

    events: {
        'click .js-refresh': 'onClickRefresh'
    },

    fresh: null,
    pollView: null,

    initialize(options) {
        Viewmaster.prototype.initialize.call(this)

        this.listenTo(this.collection, 'newResponse', this.onNewResponse)
        this.listenTo(this.collection, 'add:response', this.update)
        this.update()
    },

    update() {

        this.fresh = this.collection.firstFresh()

        if (this.fresh) {
            createPollView(this.fresh)
                .then(pollView => {
                    this.pollView = pollView
                    this.setView('main', this.pollView)
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
        this.pollView && _.invoke([this.pollView], 'postRender')
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
