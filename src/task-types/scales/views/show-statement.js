import { View } from 'backbone.marionette'
import template from '../hbs/show-statement.hbs'

export default View.extend({
    tagName: 'li',
    template,
    templateContext() {
        return {
            index: this.model.collection.indexOf(this.model)
        }
    },
    onAttach() {
        const Hub = window.MathJax.Hub
        Hub.Queue(['Typeset', Hub, this.el])
    }
})
