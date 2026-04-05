import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default {
  name: 'menuSection',
  title: 'Menu Section',
  type: 'document',
  orderings: [orderRankOrdering],
  preview: {
    select: {
      name: 'name',
    },
    prepare(selection) {
      return {
        title: selection.name || 'Untitled Section',
      }
    },
  },
  fields: [
    orderRankField({type: 'menuSection', hidden: true}),
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
  ],
}
