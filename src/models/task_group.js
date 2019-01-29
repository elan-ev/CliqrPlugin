import Backbone from 'backbone'
import _ from 'underscore'
import shorten from '../helpers/shorten'

const actionMap = function(action) {
    const map = {
        create: 'create',
        update: 'update',
        delete: 'destroy',
        read: 'show'
    }
    return map[action] || action
}

const TaskGroup = Backbone.Model.extend({
    defaults: {
        tasks_count: 0
    },

    sync(method, model, options) {
        _.extend(options, {
            url: typeof model.url === 'function' ? model.url(actionMap(method)) : void 0
        })
        return Backbone.sync(method, model, options)
    },

    url(action) {
        let id = this.id != null ? '/' + this.id : ''
        const url = [window.cliqr.config.PLUGIN_URL, 'task_groups/', action, id, '?cid=' + window.cliqr.config.CID]

        if (action === 'show') {
            url.push('&include=tasks')
        }

        return url.join('')
    },

    duplicate() {
        const options = {}
        return this.sync('duplicate', this, options).then(attrs => new TaskGroup(attrs))
    },

    exportURL() {
        return this.url('export')
    },

    reorder(positions) {
        return Backbone.ajax({
            accepts: 'application/json',
            contentType: 'application/json',
            data: JSON.stringify(positions),
            method: 'PATCH',
            url: this.url('tasks')
        })
    },

    getTitle(len = null) {
        const title = this.get('title')

        return len ? shorten(title.trim(), len) : title
    }
})

export default TaskGroup
