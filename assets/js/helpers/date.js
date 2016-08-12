const pad = function (n) {
    return n < 10 ? '0' + n : n
}

const date = function (n) {
    const d = new Date(n * 1000)
    return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + pad(d.getFullYear())
}

export default date
