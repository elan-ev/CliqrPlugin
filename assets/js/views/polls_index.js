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
    pollView: null,

    initialize(options) {
        Viewmaster.prototype.initialize.call(this)
        this.listenTo(this.collection, 'newResponse', this.onNewResponse)
        this.listenTo(this.collection, 'add:response', this.update)
        // this.listenTo(this.collection, 'all', console.log)
        this.update("initialize")
    },

    update(...args) {
        // console.log("polls_index::update", args)

        let pollView
        this.fresh = this.collection.firstFresh()

        if (this.fresh) {
            this.pollView = createPollView(this.fresh)
            this.setView('main', this.pollView)
        } else {
            this.clearViews('main')
        }

        this.refreshViews()
        this.render()
        this.postRender()
    },

    template: require('../../hbs/polls_index.hbs'),

    context() {
        return {
            polls: this.collection.toJSON(),
            hasFresh: !!this.fresh
        }
    },

    afterTemplate() {
        // console.log("afterTemplate")
    },

    postRender() {
        if (this.pollView) {
            this.pollView.postRender && this.pollView.postRender()
        }
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
