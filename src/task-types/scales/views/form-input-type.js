import { View } from 'backbone.marionette';
import inputTypeTemplate from '../hbs/form-input-type.hbs';

export default View.extend({
    tagName: 'label',
    className: 'cliqr--scales-input-type',

    ui: {
        radios: 'input[name="input-type"]',
    },

    events: {
        'change @ui.radios': 'onChangeRadio',
    },

    modelEvents: {
        change: 'render',
    },

    template: inputTypeTemplate,

    templateContext() {
        const input_type = this.model.getInputType();

        return {
            count_values: this.model.getCountValues(),
            disabled: !this.model.isSmallRange(),
            is_slider: input_type !== 'select',
        };
    },

    onChangeRadio(event) {
        const value = this.el.querySelector('input[name="input-type"]:checked').value;
        this.model.setInputType(value);
    },
});