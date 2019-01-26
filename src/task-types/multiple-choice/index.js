import showError from '../../error'

const loader = async function() {
    try {
        const {
            default: klass
        } = await import(/* webpackChunkName: "task-type.multiple-choice" */ './multiple-choice.js')
        return klass
    } catch (err) {
        showError('Es ist ein Fehler aufgetreten.', err)
    }
}

export default {
    id: 'multiple-choice',
    name: 'Multiple Choice',
    icon: 'assessment',
    loader
}
