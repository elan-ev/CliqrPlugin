import Backbone from 'backbone'
import _ from 'underscore'

let currentView = false

let loader = false
let timeout = false

const showLoading = function () {
    timeout = setTimeout( () => {
        loader = Backbone.$('<span class="cliqr-loader"/>')
            .html('Loading...').prependTo('#layout_content')
    }, 200)
}

const hideLoading = function () {
    clearTimeout(timeout)
    if (loader) {
        loader.remove()
    }
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
    container.prepend(view.render().$el)
    return typeof view.postRender === 'function' ? view.postRender() : void 0
}

export { showLoading, hideLoading, userRole, getContainer, activateNavigation, changeToPage }
