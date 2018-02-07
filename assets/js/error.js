import Raven from 'raven-js'

export default function showError(errorMessage, data) {
    console.error(errorMessage, data)
    window.STUDIP.Dialog.show(errorMessage)
    Raven.captureException(`errorMessage: ${JSON.stringify(data)}`)
}
