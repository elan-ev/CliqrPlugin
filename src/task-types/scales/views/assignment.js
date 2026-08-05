import Backbone from 'backbone';
import Radio from 'backbone.radio';
import { View } from 'backbone.marionette';
import template from '../hbs/assignment.hbs';
import StatementsView from './assignment-statements.js';

export default View.extend({
    tagName: 'section',
    className: 'cliqr--scales-assignment-view',

    regions: {
        statements: 'main',
    },

    events: {
        'change .sorted': 'onChangeSorted',
    },

    initialize({ voting }) {
        this.voting = voting;
        this.statements = new Backbone.Collection(this.model.get('task').statements);
        this.sorted = false;
    },

    template,

    templateContext() {
        const input_type = this.model.getRealInputType();
        return {
            start: this.voting.get('start'),
            task: {
                ...this.model.toJSON(),
                input_type,
            },
            isRunning: this.voting.isRunning(),
            sorted: this.sorted,
        };
    },

    onRender() {
        const statements = new StatementsView({
            collection: this.statements,
            voting: this.voting,
            sorted: this.sorted,
        });
        this.showChildView('statements', statements);
    },

    onAttach() {
        Radio.channel('layout').request(
            'apply:mathjax',
            this.$('.cliqr--scales-description').eq(0),
        );
    },

    onChangeSorted(event) {
        const sorted = event.target.checked;
        if (sorted !== this.sorted) {
            this.sorted = sorted;
            this.render();
        }
    },
});