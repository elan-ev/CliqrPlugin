import Backbone from 'backbone'
import _ from 'underscore'

import showError from '../error'
import Task from './task'

const actionMap = {
    create: 'create',
    update: 'update',
    delete: 'destroy',
    read: 'show'
}

const Voting = Backbone.Model.extend({

    sync(method, model, options) {
        _.extend(options, {
            url: typeof model.url === 'function' ? model.url(actionMap[method]) : void 0
        })
        return Backbone.sync(method, model, options)
    },

    url(action) {
        let id = this.id != null ? '/' + this.id : ''
        return window.cliqr.config.PLUGIN_URL + ('votings/' + action + id + '?cid=') + window.cliqr.config.CID
    },

    getTask() {
        const test = this.get('test')
        if (test) {
            return new Task(_.first(test.tasks))
        }

        return null
    },

    isRunning() {
        if (this.has('is_running')) {
            return this.get('is_running')
        }

        const start = new Date(this.get('start')).valueOf(),
              end = new Date(this.get('end')).valueOf() || Infinity,
              now = new Date().valueOf()

        return start <= now && now <= end
    },

    addResponse(newResponse) {
        newResponse.save({ course_id: window.cliqr.config.CID })
            .then(response => {
                this.trigger('add:response', this, newResponse)
                return null
            })
            .catch(error => {
                showError('Could not add response, error')
            })
    },

    stop() {
        return this.save({ end: new Date().toISOString() })
    }
})

export default Voting
