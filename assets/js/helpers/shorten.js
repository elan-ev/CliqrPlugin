function shorten(text, length) {
    const strText = '' + text
    return strText.length <= length ? strText : '' + strText.slice(0, length - 2) + '[…]'
}

export default shorten
