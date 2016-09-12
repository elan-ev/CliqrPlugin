import utils from '../utils'

const user_role = function (expected, options) {
    return utils.userRole(expected) ? options.fn(this) : options.inverse(this)
}

export default user_role
