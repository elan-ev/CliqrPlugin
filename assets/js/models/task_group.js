import Backbone from 'backbone'
import _ from 'underscore'

const actionMap = function (action) {
    const map = {
        create: 'create',
        update: 'update',
        delete: 'destroy',
        read: 'show'
    }
    return map[action] || action
}

const TaskGroup = Backbone.Model.extend({

    sync(method, model, options) {
        _.extend(options, {
            url: typeof model.url === 'function' ? model.url(actionMap(method)) : void 0
        });
        return Backbone.sync(method, model, options)
    },

    url(action) {
        let id = this.id != null ? '/' + this.id : ''
        return cliqr.config.PLUGIN_URL + ('task_groups/' + action + id + '?cid=') + cliqr.config.CID
    },

    duplicate() {
        const options = {}
        return this.sync('duplicate', this, options).then((attrs) => new TaskGroup(attrs))
    },

    exportURL() {
        return this.url('export')
    }
})

export default TaskGroup
