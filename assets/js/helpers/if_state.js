const if_state = function(context, options) {
    return this.state === context ? options.fn(this) : options.inverse(this)
}

export default if_state
