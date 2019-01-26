import { SafeString, escapeExpression } from 'handlebars/runtime'

const concat = function(...args) {
    args.pop()
    return new SafeString(args.join(''))
}

export default concat
