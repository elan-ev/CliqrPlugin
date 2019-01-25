import { SafeString } from 'handlebars/runtime'
import timeago from 'timeago.js'
import deLocale from 'timeago.js/locales/de'

timeago.register('de_DE', deLocale)
const ta = new timeago()

const moment_helper = function(n, { hash }) {
    let { label = null } = hash
    const date = new Date(n),
        taDate = label || ta.format(date, 'de_DE')

    return new SafeString(`<span class="cliqr--moment" data-tooltip="${date.toLocaleString()}">${taDate}</span>`)
}

export default moment_helper
