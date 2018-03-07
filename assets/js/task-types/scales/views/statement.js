import _ from 'underscore'
import Viewmaster from '../../../views/viewmaster'
import histogramView from './histogram'

const StatementView = Viewmaster.extend({
    tagName: 'li',

    initialize({ statement, index }) {
        Viewmaster.prototype.initialize.call(this)

        this.statement = statement
        this.index = index

        this.listenTo(this.model, 'change', this.render)
    },

    responses() {
        return _.reduce(
            _.pluck(this.model.get('responses'), 'answer'),
            (memo, r) => _.isArray(r) && !_.isUndefined(r[this.index]) ? memo.concat(r[this.index]) : memo,
            [])
    },

    template: require('../hbs/assignment_statement.hbs'),

    context() {
        return {
            ...this.statement,
            responses: this.responses(),
            isRunning: this.model.isRunning()
        }
    },

    afterTemplate() {
        if (!this.model.isRunning()) {
            // this.magic()
        }
    },

    magic() {
        if (window.document.body.contains(this.el)) {
            histogramView(
                this.$el,
                this.responses(),
                this.statement.lrange_value,
                this.statement.hrange_value,
            )
        }
    },

    postRender() {
        if (!this.model.isRunning()) {
            this.magic()
        }
    }
})

export default StatementView
