import './public-path.js'
import '@babel/polyfill'
import Backbone from 'backbone'
import { Application, MnObject, View } from 'backbone.marionette'
import '../scss/core.scss'
import StudipRouter from './routers/studip'
import setupHandlebars from './setupHandlebars.js'
import store from './store/index'
import SidebarView from './views/sidebar/view'

const NotificationHandler = MnObject.extend({
    channelName: 'layout',

    radioRequests: {
        'change:pagetitle': 'onChangePagetitle',
        'scroll:top': 'onScrollTop'
    },

    initialize({ layout }) {
        this.layout = layout
    },

    onChangePagetitle(newTitle) {
        const title = document.head.querySelector('title')
        const original = title && title.dataset.original
        if (original) {
            const prefix = original.substring(0, original.length - 5)
            this.layout.triggerMethod('change:pagetitle', prefix + newTitle)
        }
    },

    onScrollTop() {
        const { left, top } = this.layout.$el.offset()
        Backbone.$('html, body').animate({ scrollLeft: left - 20, scrollTop: top - 20 })
    }
})

const MyBaseLayout = View.extend({
    template: false,

    regions: {
        content: '#cliqr',
        pageTitle: '#current_page_title',
        sidebar: {
            el: '#layout-sidebar',
            replaceElement: false
        }
    },

    initialize() {
        this.showChildView('sidebar', new SidebarView({ el: '#layout-sidebar', store }))
        this.router = new StudipRouter({ selector: this.getRegion('content').$el, store })

        this.notificationHandler = new NotificationHandler({ layout: this })
    },

    onChangePagetitle(title) {
        document.title = title
        this.getRegion('pageTitle').$el.text(title)
    }
})

const StudipCliqrApplication = Application.extend({
    region: '#layout_page',

    initialize() {
        setupHandlebars()

        // @ts-ignore
        Backbone.$ = window.jQuery
        // @ts-ignore
        Backbone._ = window._

        // @ts-ignore
        Backbone.ajax = function() {
            const xhr = Backbone.$.ajax.apply(Backbone.$, arguments)
            return Promise.resolve(xhr)
        }

        Backbone.$(document).on('click', '.cliqr--click-once', e => {
            Backbone.$(e.target)
                .closest('button')
                .prop('disabled', true)
                .addClass('loading')
        })

        Backbone.$(document).on('mouseleave', '.cliqr--moment, .cliqr--button-fab', function(event) {
            const { tooltipObject } = Backbone.$(this).data()
            tooltipObject && tooltipObject.hide()
        })
    },

    onBeforeStart(app, options) {
        // console.log('onBeforeStart', app, options)
        // this.model = new MyModel(options.data);
    },

    onStart(app, options) {
        // console.log('onStart', app, options)
        this.showView(new MyBaseLayout({ el: '#layout_container' }))
        Backbone.history.start()
    }
})

const myApp = new StudipCliqrApplication()

myApp.start({
    data: {}
})
