import { SafeString, escapeExpression } from 'handlebars/runtime.js';

const icon = function (icon, { hash }) {
    let { color = 'blue', text = '' } = hash;

    color = escapeExpression(color);
    icon = escapeExpression(icon);
    text = escapeExpression(text);

    const addClasses = escapeExpression(hash['class']) || '';

    return new SafeString(
        `<svg class="cliqr--icon cliqr--icon-${icon} cliqr--icon-color-${color} ${addClasses}" alt="${text}" title="${text}"><use xlink:href="#${icon}"></use></svg>`,
    );
};

export default icon;