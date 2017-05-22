import Backbone from 'backbone'
import _ from 'underscore'

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
        });
        return Backbone.sync(method, model, options)
    },

    url(action) {
        let id = this.id != null ? '/' + this.id : ''
        return cliqr.config.PLUGIN_URL + ('votings/' + action + id + '?cid=') + cliqr.config.CID
    },

    getTask() {
        const test = this.get('test')
        if (test) {
            return new Task(_.first(test.tasks))
        }

        return null
    },

    isRunning() {
        const start = new Date(this.get('start')).valueOf(),
              end = new Date(this.get('end')).valueOf() || Infinity,
              now = new Date().valueOf()
        return start <= now && now <= end
    },

    addResponse(newResponse) {
        newResponse.save({ course_id: cliqr.config.CID })
            .then(response => {
                this.trigger('add:response', this, newResponse)
                return null
            })
    },

    stop() {
        return this.save({ end: new Date().toISOString() })
    }
})

export default Voting
