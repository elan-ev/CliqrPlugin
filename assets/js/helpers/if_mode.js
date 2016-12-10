const if_mode = function (context, options) {
    return this.$mode === context ? options.fn(this) : options.inverse(this)
}

module.exports = if_mode
