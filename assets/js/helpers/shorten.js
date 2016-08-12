function shorten (text) {
    return text.length > 13 ? '' + text.slice(0, 11) + '[…]' : text
}

export default shorten
