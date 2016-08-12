import Backbone from 'backbone'
import _ from 'underscore'

import utils from '../utils'

const defaultFilterCallback = function (text, searchValue, item) {
    return text.toString().toLowerCase().indexOf(searchValue) === -1
}

const QuestionsIndexView = Backbone.View.extend({

    className: 'page',
    id: 'questions-index',

    events: {
        'submit form': 'submitFilter',
        'keyup  input.search': 'filterList',
        'change input.search': 'filterList',
        'input  input.search': 'filterList'
    },

    groupCollection() {
        const groups = this.collection.groupByDate()
        return _.reduce(_.keys(groups).reverse(), (memo, date) => {
            memo.push({
                divider: true,
                startdate: date === 'null' ? null : date
            })

            _.each(groups[date].reverse(), (question) => memo.push(question.toJSON()))

            return memo
        }, [])
    },

    render() {
        const template = require('../../hbs/questions-index.hbs')
        this.$el.html(template({ grouped: this.groupCollection() }))
        return this
    },

    lastval: '',

    filterList(e) {

        const search = this.$('input.search'),
              val = search[0].value.toLowerCase(),
              list = this.$('ol')

        let listItems = null,
            childItems = false,
            itemtext = '',
            item

        if (this.lastval === val) {
            return
        }

        if (val.length < this.lastval.length || val.indexOf(this.lastval) !== 0) {
            listItems = list.children()
        } else {
            listItems = list.children(':not(.ui-screen-hidden)')
        }

        this.lastval = val

        if (val) {

            // This handles hiding regular rows without the text we search for
            // and any list dividers without regular rows shown under it

            for (let i = listItems.length - 1; i >= 0; ++i) {
                item = Backbone.$(listItems[i])
                itemtext = item.text()

                if (item.hasClass('divider')) {
                    item.toggleClass('ui-filter-hidequeue', !childItems)
                    // new bucket!
                    childItems = false
                }

                else if (defaultFilterCallback(itemtext, val, item)) {
                    // mark to be hidden
                    item.toggleClass('ui-filter-hidequeue', true)
                }

                else {
                    // there's a shown item in the bucket
                    childItems = true
                }
            }

            // Show items, not marked to be hidden
            listItems.filter(':not(.ui-filter-hidequeue)').toggleClass('ui-screen-hidden', false)


            // Hide items, marked to be hidden
            listItems.filter('.ui-filter-hidequeue').toggleClass('ui-screen-hidden', true).toggleClass('ui-filter-hidequeue', false)

        } else {
            // filtervalue is empty => show all
            listItems.toggleClass('ui-screen-hidden', false)
        }
    },

    submitFilter() {
        this.$('input.search').blur()
        return false
    }
})

export default QuestionsIndexView
