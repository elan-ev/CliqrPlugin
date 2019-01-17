import Backbone from 'backbone'
import _ from 'underscore'

let currentView
let timeout

const showLoading = function() {
    timeout = setTimeout(() => {
        Backbone.$(window.document.body).addClass('cliqr--loading')
    }, 300)
}

const hideLoading = function() {
    timeout && clearTimeout(timeout)
    Backbone.$(window.document.body).removeClass('cliqr--loading')
}

const userRole = expected => expected === window.cliqr.bootstrap.userRole

export { showLoading, hideLoading, userRole, changeToPage }
