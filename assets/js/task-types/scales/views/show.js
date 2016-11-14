import Backbone from 'backbone'

const ShowView = Backbone.View.extend({

    tagName: 'section',

    className: 'cliqr--scales-show-view',

    render() {
        const template = require('../hbs/show.hbs')
        this.$el.html(template(this.model.toJSON()))
        return this
    },

    postRender() {
        const Hub = window.MathJax.Hub
        this.$('.cliqr--scales-description, td.text').each((index, element) => Hub.Queue([ 'Typeset', Hub, element ]))
    }
})

export default ShowView
