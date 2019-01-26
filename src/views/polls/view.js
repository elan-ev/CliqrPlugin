import { View } from 'backbone.marionette'
import taskTypes from '../../models/task_types'
import '../../assets/scss/poll.scss'
import { toast } from '../../components/toast'
import template from './polls.hbs'
import Waiting from './waiting'

const createPollView = function(voting) {
    return taskTypes.fetchTaskType(voting.getTask()).then(taskType => taskType.getPollView(voting))
}

export default View.extend({
    events: {
        'click .js-refresh': 'onClickRefresh'
    },

    collectionEvents: {
        newResponse: 'onNewResponse',
        update: 'update',
        'add:response': 'onAddResponse'
    },

    template,

    templateContext() {
        return {
            hasFresh: !!this.fresh
        }
    },

    regions: {
        mainRegion: 'main'
    },

    initialize() {
        this.update()
    },

    fresh: null,

    onAddResponse() {
        toast({
            message: 'Erfolgreich abgestimmt',
            type: 'is-success'
        })
        this.update()
    },

    update() {
        this.fresh = this.collection.firstFresh()

        if (this.fresh) {
            createPollView(this.fresh)
                .then(pollView => {
                    this.showChildView('mainRegion', pollView)
                })
                .catch(error => {
                    // TODO
                    console.log('Caught an error', error)
                })
        } else {
            this.showChildView('mainRegion', new Waiting())
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
