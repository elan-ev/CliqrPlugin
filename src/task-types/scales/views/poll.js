import { View } from 'backbone.marionette';
import Backbone from 'backbone';
import Radio from 'backbone.radio';
import _ from 'underscore';
import template from '../hbs/poll.hbs';

export default View.extend({
    className: 'cliqr--scales-poll-view',

    events: {
        'submit form': 'onSubmitForm',
    },

    initialize({ voting, type }) {
        this.voting = voting;
        this.type = type;
    },

    template,

    templateContext() {
        const task = this.type.wrapTask(this.voting.getTask());
        const { statements } = task.get('task');
        const { lrange_value, hrange_value, lrange_label, hrange_label } = task.get('task');

        const range_values = _.range(lrange_value, hrange_value + 1).map((value) => {
            let text = value;
            if (value === lrange_value && lrange_label) {
                text = `${value} – ${lrange_label}`;
            }
            if (value === hrange_value && hrange_label) {
                text = `${value} – ${hrange_label}`;
            }
            return { value, text };
        });

        const is_slider = task.getRealInputType() === 'slider';

        return {
            is_slider,
            range_values,
            response: this.model.toJSON(),
            voting: _.omit(this.voting.toJSON(), 'task'),
            task: { ...task.toJSON() },
            statements,
        };
    },

    onAttach() {
        Radio.channel('layout').request('apply:mathjax', this.$('.description, .text'));

        _.each(this.$('input[type="range"]'), (range) => {
            const $range = Backbone.$(range),
                ruler = $range.parent().find('.rangeslider__ruler').get(0),
                output = $range.parent().find('output').get(0);

            $range.rangeslider({
                polyfill: false,
                onInit() {
                    this.$range.prepend(ruler);
                    output.textContent = this.value;
                },
                onSlide(position, value) {
                    output.textContent = value;
                },
            });
        });
    },

    onSubmitForm(event) {
        event.preventDefault();
        const answer = _.map(this.$('input, select'), (el) => parseInt(el.value, 10));
        this.model.set('response', { answer });
        this.voting.trigger('newResponse', this.model, this.voting);
    },
});