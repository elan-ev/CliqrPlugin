import Backbone from 'backbone'
import _ from 'underscore'

let currentView = false

let timeout = false

const showLoading = function () {
    timeout = setTimeout( () => {
        Backbone.$(window.document.body).addClass('cliqr--loading')
    }, 300)
}

const hideLoading = function () {
    clearTimeout(timeout)
    Backbone.$(window.document.body).removeClass('cliqr--loading')
}

const userRole = (expected) => expected === window.cliqr.bootstrap.userRole

const getContainer = (selector) => Backbone.$(selector || '#cliqr-container')

const activateNavigation = function (selector = 'li:first-child') {
    Backbone.$('#sidebar-navigation ul.sidebar-navigation')
        .find('> li.active').removeClass('active').end()
        .find(selector).eq(0)
        .closest('li').addClass('active')
}

const changeToPage = function (view, selector) {
    if (currentView) {
        currentView.$el.hide()
        currentView.remove()
    }
    currentView = view
    Backbone.$(window).scrollTop(0)
    const container = getContainer(selector)
    container.prepend(view.$el)
    view.render()
    view && view.postRender && view.postRender()
}

export { showLoading, hideLoading, userRole, getContainer, activateNavigation, changeToPage }
