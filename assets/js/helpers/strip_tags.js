const strip_tags = function(html) {
    if (!html) {
        return ''
    }

    const div = window.document.createElement('div')
    div.innerHTML = html

    return div.textContent || div.innerText || ''
}

export default strip_tags
