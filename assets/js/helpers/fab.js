import { SafeString, escapeExpression } from 'handlebars/runtime'

const fab = function (klass, text, icon, { hash }) {
    let { disabled = false } = hash
    const disabledAttr = disabled ? 'disabled' : ''

    text = escapeExpression(text)
    klass = 'js-' + escapeExpression(klass)

    const addClasses = escapeExpression(hash['class']) || ''

    const icon_path =
          [window.STUDIP.ASSETS_URL, 'images/icons/blue/', escapeExpression(icon), '.svg'].join('')

    return new SafeString(`
            <button type="submit" class="button cliqr--button-fab ${klass} ${addClasses}"
                    name="${text}" ${disabledAttr}
                    data-tooltip="${text}">
                <img src="${icon_path}" alt="${text}">
            </button>`)
}

export default fab
