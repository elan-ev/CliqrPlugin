import Backbone from 'backbone'
import _ from 'underscore'
import messageBus from '../message_bus'
import Voting from './voting'
import VotingsCollection from './votings'
import shorten from '../helpers/shorten'
import stripTags from '../helpers/strip_tags'

const actionMap = function(action) {
    const map = {
        create: 'create',
        update: 'update',
        delete: 'destroy',
        read: 'show'
    }
    return map[action] || action
}

const Task = Backbone.Model.extend({
    sync(method, model, options) {
        _.extend(options, {
            url: typeof model.url === 'function' ? model.url(actionMap(method)) : void 0
        })
        return Backbone.sync(method, model, options)
    },

    url(action) {
        let id = this.id != null ? '/' + this.id : ''
        return window.cliqr.config.PLUGIN_URL + ('tasks/' + action + id + '?cid=') + window.cliqr.config.CID
    },

    getTitle(len = false) {
        const title = this.get('title') || stripTags(this.get('description'))
        return len ? shorten(title.trim(), len) : title
    },

    getVotings() {
        if (!this.votings) {
            this.votings = new VotingsCollection(_.map(this.get('votings') || [], v => new Voting(v)))
            this.listenTo(this.votings, 'change', (...args) => this.trigger('change', ...args))
        }
        return this.votings
    },

    STATE_NEW: 'new',
    STATE_IS_ACTIVE: 'is_active',
    STATE_WAS_ACTIVE: 'was_active',

    getCurrentState() {
        const votings = this.getVotings()

        if (!votings.length) {
            return this.STATE_NEW
        }

        const did_run = _.some(votings.models, a => a.isRunning())
        return did_run ? this.STATE_IS_ACTIVE : this.STATE_WAS_ACTIVE
    },

    duplicate() {
        const options = {}
        return this.sync('duplicate', this, options).then(attrs => new Task(attrs))
    },

    startVoting() {
        const vtng = new Voting({ task_id: this.id })

        return vtng.save().then(model => {
            messageBus.broadcast('start:voting', model)

            return model
        })
    }
})

export default Task
