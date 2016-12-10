const if_state = function (context, options) {
    return this.state === context ? options.fn(this) : options.inverse(this)
}

module.exports = if_state
