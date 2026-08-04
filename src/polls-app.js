import './public-path.js';
import Backbone from 'backbone';
import { Application } from 'backbone.marionette';
import PollsCollection from './models/polls.js';
import setupHandlebars from './setupHandlebars.js';
import LayoutNotificationHandler from './layout-notification-handler.js';
import PollsIndexView from './views/polls/view.js';

const PollsCliqrApplication = Application.extend({
    region: '#cliqr-poll-container',

    initialize() {
        setupHandlebars();
        // @ts-ignore
        Backbone.$ = window.jQuery;
        // @ts-ignore
        Backbone._ = window._;

        // @ts-ignore
        Backbone.ajax = function () {
            const xhr = Backbone.$.ajax.apply(Backbone.$, arguments);
            return Promise.resolve(xhr);
        };

        this.layoutNotificationHandler = new LayoutNotificationHandler();
    },

    onBeforeStart(app, options) {
        if (window.cliqr.bootstrap.polls) {
            this.collection = new PollsCollection(window.cliqr.bootstrap.polls || []);
            delete window.cliqr.bootstrap.polls;
        }

        this.collection = new PollsCollection();
    },

    onStart(app, options) {
        this.collection
            .fetch()
            .then(() => {
                const page = new PollsIndexView({ collection: this.collection });
                this.showView(page);
            })
            .catch((error) => {
                console.error('Failed to fetch polls', error);
            });
        Backbone.history.start();
    },
});

const pollsApp = new PollsCliqrApplication();

pollsApp.start({
    data: {},
});