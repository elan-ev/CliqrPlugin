import TemplateView from './template_view'
import QuestionsForm from './questions_form'

const QuestionsNewView = TemplateView.extend({
    template_id: 'questions-new',

    className: 'page',

    initialize() {
        this.form = new QuestionsForm()
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
        this.form.remove()
        TemplateView.prototype.remove.call(this)
    }
})

export default QuestionsNewView
