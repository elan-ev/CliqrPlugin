import _ from 'underscore'
import Viewmaster from './viewmaster'

const ArchiveView = Viewmaster.extend({

    tagName: 'article',

    className: 'cliqr--archive',

    template: require('../../hbs/archive.hbs'),

    context() {
        return {
            votings: this.collection
                .filter(voting => !voting.isRunning())
                .reverse()
                .map(v => {
                    return {
                        ..._.omit(v.toJSON(), 'tasks'),
                        task: v.getTask().toJSON(),
                        responses_count: v.get('responses').length
                    }
                })
        }
    }
})

export default ArchiveView
