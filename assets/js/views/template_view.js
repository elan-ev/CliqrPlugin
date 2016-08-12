import Backbone from 'backbone'
import utils from '../utils'

const TemplateView = Backbone.View.extend({
    template() {
        this.template = utils.compileTemplate(this.template_id);
        return this.template.apply(this, arguments);
    }
})

export default TemplateView
