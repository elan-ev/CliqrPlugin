import { View } from 'backbone.marionette'
import Radio from 'backbone.radio'
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
        Radio.channel('layout').request('apply:mathjax', this.$el)
    }
})
