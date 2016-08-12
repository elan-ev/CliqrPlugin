import Backbone from 'backbone'
import _ from 'underscore'

const actionMap = {
    create: 'create',
    update: 'update',
    delete: 'destroy',
    read: 'show'
}

const Question = Backbone.Model.extend({

    sync(method, model, options) {
        _.extend(options, {
            url: typeof model.url === 'function' ? model.url(actionMap[method]) : void 0
        });
        return Backbone.sync(method, model, options)
    },

    url(action) {
        let id = this.id != null ? '/' + this.id : ''
        return cliqr.config.PLUGIN_URL + ('questions/' + action + id + '?cid=') + cliqr.config.CID
    },

    start() {
        const url = cliqr.config.PLUGIN_URL + ('questions/start/' + this.id + '?cid=') + cliqr.config.CID
        return jQuery.post(url)
    },

    stop() {
        const url = cliqr.config.PLUGIN_URL + ('questions/stop/' + this.id + '?cid=') + cliqr.config.CID
        return jQuery.post(url)
    }
})

export default Question
