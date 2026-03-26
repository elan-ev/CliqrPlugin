import { View } from 'backbone.marionette';
import Radio from 'backbone.radio';
import _ from 'underscore';
import template from '../hbs/assignment-statement.hbs';
import histogramView from './histogram.js';

export default View.extend({
    tagName: 'li',
    template,

    modelEvents: {
        change: 'render',
    },

    initialize(options) {
        this.voting = options.voting;
        this.listenTo(this.voting, 'change', this.render);

        const index = this.model.collection.indexOf(this.model);
        this.responses = this.voting.get('responses').map((r) => r.answer && r.answer[index]);
    },

    templateContext() {
        return {
            isRunning: this.voting.isRunning(),
            stats: this.getStats(),
        };
    },

    onAttach() {
        Radio.channel('layout').request('apply:mathjax', this.$('.text').eq(0));

        if (!this.voting.isRunning()) {
            const { lrange_value, hrange_value } = this.voting.getTask().get('task');
            histogramView(this.$el, this.responses, lrange_value, hrange_value);
        }
    },

    getMean() {
        return _.mean(this.responses);
    },

    getStandardDeviation() {
        if (this.responses.length === 0) {
            return 0;
        }
        const mean = this.getMean();

        return Math.sqrt(_.meanBy(this.responses, (x) => (x - mean) ** 2));
    },

    getStats() {
        const mean = Math.round(this.getMean() * 100) / 100;
        const sd = Math.round(this.getStandardDeviation() * 100) / 100;

        return isNaN(mean) ? '' : `Durchschnitt=${mean} Standardabweichung=${sd}`;
    },
});