import TemplateView from './template_view'
import QuestionsForm from './questions_form'

const QuestionsEditView = TemplateView.extend({

    template_id: 'questions-edit',
    className: 'page',

    initialize() {
        this.form = new QuestionsForm({
            model: this.model
        })
    },

    render() {
        this.$el.html(this.template())
        this.$el.append(this.form.render().el)
        return this
    },

    postRender() {
        this.form.postRender()
    },

    remove() {
        this.form.remove();
        TemplateView.prototype.remove.call(this)
    }
})

export default QuestionsEditView
