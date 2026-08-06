import _ from 'underscore';
import Task from '../../../models/task.js';

const classProperties = {
    SMALL_RANGE: 20,
};

const ScalesTask = Task.extend(
    {
        defaults: {
            type: 'scales',
            task: {
                statements: [],
                lrange_value: 1,
                lrange_label: null,
                hrange_value: 10,
                hrange_label: null,
                input_type: null,
            },
        },

        validate({ title, description, task }, options) {
            if (!title || _.isEmpty(title)) {
                return 'Der Titel darf nicht leer sein.';
            }

            if (!description || _.isEmpty(description)) {
                return 'Der Fragetext darf nicht leer sein.';
            }

            if (window.STUDIP.wysiwyg && description.trim() === window.STUDIP.wysiwyg.htmlMarker) {
                return 'Die Aufgabenbeschreibung darf nicht leer sein.';
            }

            if (!task) {
                return 'Task fehlt.';
            }

            const { statements = false, lrange_value, hrange_value, input_type } = task;

            if (!statements || _.isEmpty(statements)) {
                return 'Es wird mindestens eine Aussage benötigt.';
            }

            if (typeof lrange_value != 'number' || isNaN(lrange_value)) {
                return 'Das Minimum muss eine Zahl sein.';
            }

            if (typeof hrange_value != 'number' || isNaN(hrange_value)) {
                return 'Das Maximum muss eine Zahl sein.';
            }

            if (lrange_value >= hrange_value) {
                return 'Das Minimum muss kleiner als das Maximum sein.';
            }

            if (input_type && !['slider', 'select'].includes(input_type)) {
                return 'Der Eingabetyp ist ungültig.';
            }

            return null;
        },

        addStatement(data = {}, options = {}) {
            const oldTask = this.get('task');
            const statements = [...oldTask.statements, { text: '', ...data }];
            this.set('task', { ...oldTask, statements }, options);
        },

        removeStatement(index, options = {}) {
            const oldTask = this.get('task');
            const statements = [
                ...oldTask.statements.slice(0, index),
                ...oldTask.statements.slice(index + 1),
            ];
            this.set('task', { ...oldTask, statements });
        },

        updateStatement(index, data, options = {}) {
            const oldTask = this.get('task');
            const selectedStatement = oldTask.statements[index];
            const statements = [
                ...oldTask.statements.slice(0, index),
                { ...selectedStatement, ...data },
                ...oldTask.statements.slice(index + 1),
            ];
            this.set('task', { ...oldTask, statements }, { silent: true });
        },

        setLRange(lrange_value) {
            this.set('task', { ...this.get('task'), lrange_value });
        },

        setHRange(hrange_value) {
            this.set('task', { ...this.get('task'), hrange_value });
        },

        setDimensions(lrange_label, hrange_label) {
            this.set('task', { ...this.get('task'), lrange_label, hrange_label }, { silent: true });
        },

        setInputType(input_type) {
            this.set('task', { ...this.get('task'), input_type }, { silent: true });
        },

        getInputType() {
            return this.get('task').input_type;
        },

        getRealInputType() {
            const { input_type } = this.get('task');

            return this.isSmallRange() ? (input_type ?? 'slider') : 'slider';
        },

        getCountValues() {
            const task = this.get('task');

            return task.hrange_value - task.lrange_value + 1;
        },

        isSmallRange() {
            return this.getCountValues() <= ScalesTask.SMALL_RANGE;
        },
    },
    classProperties,
);

export default ScalesTask;