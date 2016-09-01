import Backbone from 'backbone'
import _ from 'underscore'

const actionMap = {
    create: 'create',
    update: 'update',
    delete: 'destroy',
    read: 'show'
}

const Assignment = Backbone.Model.extend({

    sync(method, model, options) {
        _.extend(options, {
            url: typeof model.url === 'function' ? model.url(actionMap[method]) : void 0
        });
        return Backbone.sync(method, model, options)
    },

    url(action) {
        let id = this.id != null ? '/' + this.id : ''
        return cliqr.config.PLUGIN_URL + ('assignments/' + action + id + '?cid=') + cliqr.config.CID
    },

    isBetween(now = new Date().valueOf()) {
        const start = new Date(this.get('start')).valueOf(),
              end = new Date(this.get('end')).valueOf() || Infinity
        return start <= now && now <= end
    }
})

export default Assignment
