import Backbone from 'backbone'
import _ from 'underscore'

import utils from '../utils'

const PollsShowView = Backbone.View.extend({

    className: 'page',
    id: 'polls-show',

    events: {
    },

    initialize(options) {
    },

    render() {
        const template = require('../../hbs/polls_show.hbs')
        const data = this.model.toJSON()
        this.$el.html(template(data))
        return this
    }
})

export default PollsShowView
