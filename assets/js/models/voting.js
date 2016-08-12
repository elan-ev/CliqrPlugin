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
        return new Task(this.get('task'))
    },

    isRunning() {
        const start = new Date(this.get('start')).valueOf(),
              end = new Date(this.get('end')).valueOf(),
              now = new Date().valueOf()
        return start <= now && now <= end
    }
})

export default Voting
