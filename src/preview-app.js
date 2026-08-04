import './public-path.js';
import Backbone from 'backbone';
import { Application } from 'backbone.marionette';
import setupHandlebars from './setupHandlebars.js';
import { PreviewView } from './views/tasks/index.js';
import Task from './models/task.js';
import LayoutNotificationHandler from './layout-notification-handler.js';
import showError from './error.js';

const PreviewCliqrApplication = Application.extend({
    region: '#cliqr-preview-container',

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
        this.task = null;

        if (window.cliqr?.bootstrap?.task) {
            this.task = new Task(window.cliqr.bootstrap.task);
            delete window.cliqr.bootstrap.task;
        } else {
            showError('Missing task in bootstrap.');
        }
    },

    onStart(app, options) {
        if (this.task) {
            const page = new PreviewView({ model: this.task });
            this.showView(page);
        }
        Backbone.history.start();
    },
});

const previewApp = new PreviewCliqrApplication();

previewApp.start({
    data: {},
});