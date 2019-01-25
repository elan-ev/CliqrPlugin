import { View } from 'backbone.marionette'
import template from '../hbs/form-options.hbs'

export default View.extend({
    template,

    templateContext() {
        return {
            singleSelect: this.model.getSelectType() === 'single'
        }
    },

    ui: {
        selectType: 'input[name="select-type"]'
    },

    events: {
        'change @ui.selectType': 'onChangeMultiSingle'
    },

    modelEvents: {
        change: 'render'
    },

    onChangeMultiSingle({ target }) {
        this.model.setSelectType(target.checked ? 'multiple' : 'single')
    }
})
