import './public-path.js'
import '@babel/polyfill'
import Backbone from 'backbone'
import { Application, View } from 'backbone.marionette'
import StudipRouter from './routers/studip'
import setupHandlebars from './setupHandlebars.js'
import store from './store/index'
import SidebarView from './views/sidebar/view'
import '../scss/core.scss'

const MyBaseLayout = View.extend({
    template: false,

    regions: {
        sidebar: {
            el: '#layout-sidebar',
            replaceElement: false
        },
        content: '#cliqr'
    },

    initialize() {
        this.showChildView('sidebar', new SidebarView({ el: '#layout-sidebar', store }))
        this.router = new StudipRouter({ selector: this.getRegion('content').$el, store })
    }
})

const StudipCliqrApplication = Application.extend({
    region: '#layout_container',

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

        Backbone.$(document).on('mouseleave', '.cliqr--button-fab', function(event) {
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
