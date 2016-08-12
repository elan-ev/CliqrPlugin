import Backbone from 'backbone'
import _ from 'underscore'

let currentView = false

const utils = {
    getContainer() {
        return Backbone.$('#cliqr-container')
    },

    changeToPage(view) {
        let container
        if (currentView) {
            currentView.$el.hide()
            currentView.remove()
        }
        currentView = view
        Backbone.$(window).scrollTop(0)
        container = this.getContainer()
        container.prepend(view.render().$el)
        return typeof view.postRender === 'function' ? view.postRender() : void 0
    }
}

export default utils
