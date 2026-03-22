import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'JP Kelly CMS',
  projectId: 'tl4n7qut',
  dataset: 'production',
  plugins: [
    deskTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(
                S.editor()
                  .id('siteSettings')
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.documentTypeListItem('project')
              .title('Projects')
              .child(
                S.documentTypeList('project')
                  .title('Projects')
                  .defaultOrdering([{field: 'orderRank', direction: 'asc'}])
              ),
            orderableDocumentListDeskItem({
              type: 'project',
              title: 'Reorder Projects',
              S,
              context,
            }),
            ...S.documentTypeListItems().filter(
              (item) => !['siteSettings', 'project'].includes(item.getId())
            ),
          ]),
    }),
  ],
  document: {
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter((templateItem) => templateItem.templateId !== 'siteSettings')
      }
      return prev
    },
    actions: (prev, {schemaType}) => {
      if (schemaType === 'siteSettings') {
        return prev.filter(
          (actionItem) => actionItem.action !== 'duplicate' && actionItem.action !== 'delete'
        )
      }
      return prev
    },
  },
  schema: {
    types: schemaTypes,
  },
})
