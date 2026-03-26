import { SafeString, escapeExpression } from 'handlebars/runtime.js';

const i18n = function (text, { hash }) {
    text = escapeExpression(text);
    return new SafeString(text);
};

export default i18n;