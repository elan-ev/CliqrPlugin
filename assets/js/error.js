export default function showError(errorMessage, data) {
    console.log(data)
    window.STUDIP.Dialog.show(errorMessage)
    debugger
}
