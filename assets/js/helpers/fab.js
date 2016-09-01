import { SafeString, escapeExpression } from 'handlebars/runtime'

const fab = function (klass, text, icon ) {
    text = escapeExpression(text)
    klass = 'js-' + escapeExpression(klass)

    const icon_path =
          [STUDIP.ASSETS_URL, 'images/icons/blue/', escapeExpression(icon), '.svg'].join('')

    return new SafeString(`
            <button type="submit" class="button cliqr--button-fab ${klass}" name="${text}" data-tooltip="${text}">
                <img src="${icon_path}" alt="${text}">
            </button>`)
}

export default fab
