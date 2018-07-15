import _ from 'underscore'
import Viewmaster from '../../../views/viewmaster'
import StatementView from './statement'
import template from '../hbs/assignment.hbs'

const AssignmentView = Viewmaster.extend({
    template,

    tagName: 'section',

    className: 'cliqr--scales-assignment-view',

    initialize({ voting }) {
        Viewmaster.prototype.initialize.call(this)

        this.voting = voting

        const task = _.omit(this.model.get('task'), 'statements')

        _.each(this.model.get('task').statements, (statement, index) => {
            this.appendView(
                '.cliqr--scales-statements',
                new StatementView({
                    model: this.voting,
                    statement: { ...task, ...statement },
                    index
                })
            )
        })
        this.refreshViews()
    },

    context() {
        return {
            task: this.model.toJSON(),
            isRunning: this.voting.isRunning()
        }
    },

    postRender() {
        const Hub = window.MathJax.Hub
        this.$('.cliqr--scales-description, td.text').each((index, element) =>
            Hub.Queue(['Typeset', Hub, element])
        )

        const views = this.getViews('.cliqr--scales-statements')
        views && _.invoke(views, 'postRender')

        const { lrange_value, hrange_value } = this.model.get('task')
        const value = Math.floor(0.382 * (hrange_value + lrange_value))

        this.$('.cliqr--scales-slider').slider({
            min: lrange_value,
            max: hrange_value,
            value
        })
    }
})

export default AssignmentView
