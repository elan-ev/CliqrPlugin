import { View } from 'backbone.marionette';
import template from './dialog.hbs';

export default View.extend({
    tagName: 'article',

    className: 'cliqr--tasks-preview',

    ui: {
        cancel: '.js-cancel',
    },

    events: {
        'click @ui.cancel': 'onClickCancel',
    },

    template,

    onClickCancel(event) {
        event.preventDefault();
        this.trigger('cancel', event, this);
    },
});