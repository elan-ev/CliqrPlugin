import _ from 'underscore'
import Handlebars from 'Handlebars'

Handlebars.registerHelper('sampleSize', function () {
    return _.reduce(this.answers, function (sum, answer) {
        return sum + answer.counter
    }, 0)
})

Handlebars.registerHelper('shorten', function (text) {
    return text.length > 13 ? '' + text.slice(0, 11) + '[…]' : text
})

const pad = function (n) {
    return n < 10 ? '0' + n : n
}

Handlebars.registerHelper('date', function (n) {
    const d = new Date(n * 1000)
    return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + pad(d.getFullYear())
})

Handlebars.registerHelper('questions_path', function (action) {
    let path = action
    if (!(action === 'index' || action === 'new')) {
        path += '/' + this.id
    }
    return cliqr.config.PLUGIN_URL + ('questions/' + path + '?cid=') + cliqr.config.CID
})

Handlebars.registerHelper('if_state', function (context, options) {
    return this.state === context ? options.fn(this) : options.inverse(this)
})

Handlebars.registerHelper('unless_state', function (context, options) {
    [options.fn, options.inverse] = [options.inverse, options.fn]
    return Handlebars.helpers['if_state'].call(this, context, options)
})

export default Handlebars
