function shorten (text, length) {
    return text.length > length ? '' + text.slice(0, length - 2) + '[…]' : text
}

export default shorten
