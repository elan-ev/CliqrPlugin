import Backbone from 'backbone'
import _ from 'underscore'

const decorateVotings = function (votings) {
    return {
        votings: votings.map((v) => {
            return {
                ..._.omit(v.toJSON(), 'tasks'),
                task: v.getTask().toJSON(),
                responses_count: v.get('responses').length
            }
        })
    }
}

const ArchiveView = Backbone.View.extend({

    tagName: 'article',

    className: 'cliqr--archive',

    events: {
    },

    initialize(options) {
        //this.interval = setInterval( () => this.model.fetch(), 2000)
    },

    remove() {
        //clearInterval(this.interval)
        Backbone.View.prototype.remove.call(this)
    },

    render() {
        const template = require('../../hbs/archive.hbs')
        this.$el.html(template(decorateVotings(this.collection)))
        return this
    }
})

export default ArchiveView
