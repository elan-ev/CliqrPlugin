import _ from 'underscore'
import Viewmaster from '../../../views/viewmaster'
import StatementView from './statement'

const AssignmentView = Viewmaster.extend({

    tagName: 'section',

    className: 'cliqr--scales-assignment-view',

    initialize({ voting }) {
        Viewmaster.prototype.initialize.call(this)

        this.voting = voting

        const task = _.omit(this.model.get('task'), 'statements')

        _.each(this.model.get('task').statements, (statement, index) => {
            this.appendView('.cliqr--scales-statements', new StatementView({
                model: this.voting,
                statement: { ...task, ...statement },
                index
            }))
        })
    },

    template: require('../hbs/assignment.hbs'),

    context() {
        return {
            task: this.model.toJSON(),
            isRunning: this.voting.isRunning()
        }
    },

    postRender() {
        const Hub = window.MathJax.Hub
        this.$('.cliqr--scales-description, td.text').each((index, element) => Hub.Queue([ 'Typeset', Hub, element ]))

        _.invoke(this.getViews('.cliqr--scales-statements'), 'postRender')
    }
})

export default AssignmentView
