import showError from '../../error'

const loader = async function() {
    try {
        const { default: klass } = await import(/* webpackChunkName: "task-type.scales" */ './scales.js')
        return klass
    } catch (err) {
        showError('Es ist ein Fehler aufgetreten.', err)
    }
}

export default {
    id: 'scales',
    name: 'Skalen',
    icon: 'code',
    loader
}
