const unless_state = function (context, options) {
    return this.state !== context ? options.fn(this) : options.inverse(this)
}

module.exports = unless_state
