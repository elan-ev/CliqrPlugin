export default function showError(errorMessage, data) {
    console.error(errorMessage, data)
    if (window.STUDIP && window.STUDIP.Dialog) {
        window.STUDIP.Dialog.show(errorMessage, { title: 'Fehler', size: 'fit' })
    } else {
        alert(errorMessage)
    }
}
