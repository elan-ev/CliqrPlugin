import { userRole } from '../utils'

const user_role = function(expected, options) {
    return userRole(expected) ? options.fn(this) : options.inverse(this)
}

export default user_role
