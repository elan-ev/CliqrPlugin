import { SafeString } from 'handlebars/runtime'
import timeago from 'timeago.js'
import deLocale from 'timeago.js/locales/de'

timeago.register('de_DE', deLocale);
const ta = new timeago()

const moment_helper = function (n) {
    const date = ta.format(new Date(n), 'de_DE')

    return new SafeString(date)
}

export default moment_helper
