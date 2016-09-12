import Backbone from 'backbone'
import _ from 'underscore'

let currentView = false

const utils = {

    userRole(expected) {
        const role = window.cliqr.bootstrap.userRole
        return expected === role
    },

    getContainer(selector) {
        return Backbone.$(selector || '#cliqr-container')
    },

    activateNavigation(selector = 'li:first-child') {
        Backbone.$('#sidebar-navigation ul.sidebar-navigation')
            .find('> li.active').removeClass('active').end()
            .find(selector).eq(0)
            .closest('li').addClass('active')
    },

    changeToPage(view, selector) {
        let container
        if (currentView) {
            currentView.$el.hide()
            currentView.remove()
        }
        currentView = view
        Backbone.$(window).scrollTop(0)
        container = this.getContainer(selector)
        container.prepend(view.render().$el)
        return typeof view.postRender === 'function' ? view.postRender() : void 0
    }
}

export default utils
