const if_mode = function (context, options) {
    return this.$mode === context ? options.fn(this) : options.inverse(this)
}

export default if_mode
