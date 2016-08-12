import { SafeString, escapeExpression } from 'handlebars/runtime'

const button = function (text, { hash } ) {
    let { icon = false } = hash
    text = escapeExpression(text)

    if (icon) {
        const icon_path =
              [STUDIP.ASSETS_URL, 'images/icons/blue/', escapeExpression(icon), '.svg'].join('')

        return new SafeString(`
            <button type="submit" class="button cliqr--button-fab" name="${text}" data-tooltip="${text}">
                <img src="${icon_path}" alt="${text}">
            </button>`)
    }

    else {
        return new SafeString(`
            <button type="submit" class="button" name="${text}">
              ${text}
            </button>`)
    }
}

export default button
