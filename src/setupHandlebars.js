import helpers from './helpers/index.js'
import breadcrumb from './components/breadcrumb.hbs'
import widgetLayout from './views/sidebar/widgetLayout.hbs'
import Handlebars from 'handlebars-template-loader/runtime'

export default function setupHandlebars() {
    Object.entries(helpers).forEach(([name, fn]) => Handlebars.registerHelper(name, fn))
    Handlebars.registerPartial('breadcrumb', breadcrumb)
    Handlebars.registerPartial('widgetLayout', widgetLayout)
}
