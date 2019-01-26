import { View } from 'backbone.marionette'
import rangeTemplate from '../hbs/form-range.hbs'

export default View.extend({
    tagName: 'label',
    className: 'cliqr--scales-range',

    ui: {
        labels: '.cliqr--scales-llabel, .cliqr--scales-hlabel'
    },

    events: {
        'change .cliqr--scales-lrange': 'onLRangeUpdate',
        'change .cliqr--scales-hrange': 'onHRangeUpdate',

        'keypress @ui.labels': 'onLabelChange',
        'change @ui.labels': 'onLabelChange',
        'input @ui.labels': 'onLabelChange'
    },

    modelEvents: {
        change: 'render'
    },

    template: rangeTemplate,

    templateContext() {
        const task = this.model.get('task')

        return {
            lrange_max: task.hrange_value - 1,
            hrange_min: task.lrange_value + 1
        }
    },

    onLRangeUpdate(event) {
        let lrange = parseInt(this.$('.cliqr--scales-lrange').val(), 10)
        const hrange = parseInt(this.$('.cliqr--scales-hrange').val(), 10)

        if (lrange >= hrange) {
            lrange = hrange - 1
        }

        this.model.setLRange(lrange)
    },

    onHRangeUpdate(event) {
        const lrange = parseInt(this.$('.cliqr--scales-lrange').val(), 10)
        let hrange = parseInt(this.$('.cliqr--scales-hrange').val(), 10)

        if (hrange.toString().length > 7) {
            hrange = parseInt(hrange.toString().substring(0, 6), 10)
        }

        if (lrange >= hrange) {
            hrange = lrange + 1
        }

        this.model.setHRange(hrange)
    },

    onLabelChange(event) {
        const llabel = this.$('.cliqr--scales-llabel').val(),
            hlabel = this.$('.cliqr--scales-hlabel').val()

        this.model.setDimensions(llabel, hlabel)
    }
})
