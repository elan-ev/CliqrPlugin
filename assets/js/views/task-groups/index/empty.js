import { View } from 'backbone.marionette'
import emptyTemplate from './empty.hbs'

export default View.extend({
    tagName: 'tr',
    template: emptyTemplate
})
