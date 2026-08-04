import { View } from 'backbone.marionette';
import template from './preview.hbs';
import taskTypes from '../../../models/task_types.js';
import { Voting } from '../../../models/voting.js';

export default View.extend({
    regions: {
        main: 'main',
    },

    initialize() {
        this.voting = new Voting();
        this.voting.getTask = () => this.model;
    },

    template,

    onRender() {
        taskTypes
            .fetchTaskType(this.model)
            .then((taskType) => {
                const pollView = taskType.getPollView(this.voting);
                this.showChildView('main', pollView);
                const forms = [...pollView.el.querySelectorAll('form')];
                forms.forEach((form) => {
                    form.inert = true;
                    Object.assign(form.style, {
                        filter: 'grayscale(1)',
                        cursor: 'not-allowed',
                    });
                });
            })

            .catch((error) => console.log('Could not initialize poll view', error));
    },
});