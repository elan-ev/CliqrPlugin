import Backbone from 'backbone'
import _ from 'underscore'

const ErrorView = Backbone.View.extend({

    initialize(options) {
        console.log(arguments)
        this.error = options.error
    },

    render() {
        const template = require('../../hbs/error.hbs')
        this.$el.html(template({ error: this.error }))
        return this
    }
})

export default ErrorView
