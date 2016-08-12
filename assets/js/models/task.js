import Backbone from 'backbone'
import _ from 'underscore'

import Assignment from './assignment'

const actionMap = {
    create: 'create',
    update: 'update',
    delete: 'destroy',
    read: 'show'
}

const Task = Backbone.Model.extend({

    sync(method, model, options) {
        _.extend(options, {
            url: typeof model.url === 'function' ? model.url(actionMap[method]) : void 0
        });
        return Backbone.sync(method, model, options)
    },

    url(action) {
        let id = this.id != null ? '/' + this.id : ''
        return cliqr.config.PLUGIN_URL + ('tasks/' + action + id + '?cid=') + cliqr.config.CID
    },

    getAssignments() {
        const assignments = this.get('assignments');
        if (!_.isArray(assignments)) {
            throw 'NYI';
        }

        return new Backbone.Collection(_.map(assignments, a => new Assignment(a)))
    },


    STATE_NEW: 'new',
    STATE_IS_ACTIVE: 'is_active',
    STATE_WAS_ACTIVE: 'was_active',

    getCurrentState() {
        const assignments = this.getAssignments()

        if (!assignments.length) {
            return this.STATE_NEW
        }

        const did_run = assignments.any(a => a.isBetween())
        return did_run ? this.STATE_IS_ACTIVE : this.STATE_WAS_ACTIVE
    }
})

export default Task
