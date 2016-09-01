import Backbone from 'backbone'
import _ from 'underscore'

import utils from '../utils'

const PollsIndexView = Backbone.View.extend({

    className: 'page',
    id: 'polls-index',

    events: {
    },

    initialize(options) {
    },

    render() {
        const template = require('../../hbs/polls_index.hbs')
        const data = { polls: this.collection.toJSON() }
        this.$el.html(template(data))
        return this
    }
})

export default PollsIndexView
