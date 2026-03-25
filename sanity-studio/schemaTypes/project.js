import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

function uniqueProjectFieldValidation(fieldName, label) {
  return (Rule) =>
    Rule.required().custom(async (value, context) => {
      if (!value) {
        return true
      }

      const documentId = context?.document?._id
      const getClient = context?.getClient
      if (!documentId || typeof getClient !== 'function') {
        return true
      }

      const canonicalId = documentId.replace(/^drafts\./, '')
      const params = {
        draftId: `drafts.${canonicalId}`,
        publishedId: canonicalId,
        value,
      }

      const query = `count(*[_type == "project" && !(_id in [$draftId, $publishedId]) && ${fieldName} == $value])`

      const client = getClient({apiVersion: '2024-03-13'})
      const duplicateCount = await client.fetch(query, params)

      return duplicateCount === 0 || `${label} must be unique across projects.`
    })
}

export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  orderings: [orderRankOrdering],
  preview: {
    select: {
      menuLabel: 'menuLabel',
      cardTitle: 'cardTitle',
      id: 'id',
      path: 'path',
      thumbnails: 'thumbnails',
      seoImage: 'seoImage',
    },
    prepare(selection) {
      const title = selection.menuLabel || selection.cardTitle || selection.id || 'Untitled Project'
      const subtitleBase = selection.cardTitle && selection.cardTitle !== title ? selection.cardTitle : selection.id
      const subtitle = selection.path
        ? `${subtitleBase ? `${subtitleBase} · ` : ''}${selection.path}`
        : subtitleBase || ''
      const firstThumbnail = Array.isArray(selection.thumbnails)
        ? selection.thumbnails.find((item) => item && typeof item === 'object')
        : null

      return {
        title,
        subtitle,
        media: firstThumbnail || selection.seoImage,
      }
    },
  },
  fields: [
    orderRankField({ type: 'project', hidden: true }),
    { name: 'id', title: 'ID', type: 'string', validation: uniqueProjectFieldValidation('id', 'ID') },
    { name: 'path', title: 'Path', type: 'string', validation: uniqueProjectFieldValidation('path', 'Path') },
    { name: 'menuLabel', title: 'Menu Label', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'routeKey', title: 'Route Key', type: 'string', validation: uniqueProjectFieldValidation('routeKey', 'Route Key') },
    { name: 'cardTitle', title: 'Card Title', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'cardText', title: 'Card Text', type: 'text', validation: (Rule) => Rule.required() },
    { name: 'order', title: 'Display Order', type: 'number' },
    {
      name: 'thumbnails',
      title: 'Thumbnails',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    { name: 'seoTitle', title: 'SEO Title', type: 'string' },
    { name: 'seoDescription', title: 'SEO Description', type: 'text' },
    { name: 'seoImage', title: 'SEO Image', type: 'image' },
    { name: 'aliases', title: 'URL Aliases', type: 'array', of: [{ type: 'string' }] },
    {
      name: 'content',
      title: 'Page Content',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Hyperlink',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) => Rule.uri({ allowRelative: false, scheme: ['http', 'https', 'mailto'] }),
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt Text', type: 'string' },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
        {
          type: 'object',
          name: 'imageGallery',
          title: 'Image Gallery',
          fields: [
            { name: 'title', title: 'Gallery Title', type: 'string' },
            {
              name: 'items',
              title: 'Gallery Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'galleryImage',
                  title: 'Gallery Image',
                  fields: [
                    {
                      name: 'image',
                      title: 'Image',
                      type: 'image',
                      options: { hotspot: true },
                      validation: (Rule) => Rule.required(),
                    },
                    { name: 'alt', title: 'Alt Text', type: 'string' },
                    { name: 'caption', title: 'Caption', type: 'string' },
                  ],
                },
              ],
              validation: (Rule) => Rule.min(1).max(6),
            },
          ],
          preview: {
            select: {
              title: 'title',
              items: 'items',
            },
            prepare(selection) {
              const count = Array.isArray(selection.items) ? selection.items.length : 0;
              return {
                title: selection.title || 'Image Gallery',
                subtitle: `${count} image${count === 1 ? '' : 's'}`,
              };
            },
          },
        },
        {
          type: 'object',
          name: 'vimeoVideoBlock',
          title: 'Vimeo Video',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'vimeoId', title: 'Vimeo ID', type: 'number', validation: (Rule) => Rule.required() },
            {
              name: 'url',
              title: 'Vimeo URL',
              type: 'url',
              validation: (Rule) => Rule.uri({ allowRelative: false, scheme: ['http', 'https'] }),
            },
            { name: 'autoplay', title: 'Autoplay', type: 'boolean', initialValue: false },
            { name: 'loop', title: 'Loop', type: 'boolean', initialValue: false },
            { name: 'controls', title: 'Show Controls', type: 'boolean', initialValue: true },
            { name: 'portrait', title: 'Portrait', type: 'boolean', initialValue: false },
            {
              name: 'singlePortraitWidth',
              title: 'Single Portrait Width',
              type: 'string',
              initialValue: 'medium',
              options: {
                list: [
                  { title: 'Small', value: 'small' },
                  { title: 'Medium', value: 'medium' },
                  { title: 'Large', value: 'large' },
                  { title: 'Full Width', value: 'full' },
                ],
                layout: 'radio',
              },
              hidden: ({ parent }) => !parent?.portrait,
              description: 'Used when this is a single portrait video. Consecutive portrait pairs keep side-by-side layout.',
            },
            {
              name: 'singlePortraitAlignment',
              title: 'Single Portrait Alignment',
              type: 'string',
              initialValue: 'center',
              options: {
                list: [
                  { title: 'Left', value: 'left' },
                  { title: 'Center', value: 'center' },
                  { title: 'Right', value: 'right' },
                ],
                layout: 'radio',
              },
              hidden: ({ parent }) => !parent?.portrait,
              description: 'Used when this is a single portrait video. Consecutive portrait pairs keep side-by-side layout.',
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'url',
              vimeoId: 'vimeoId',
            },
            prepare(selection) {
              const title = selection.title || 'Vimeo Video';
              const subtitle = selection.subtitle || (selection.vimeoId ? `https://vimeo.com/${selection.vimeoId}` : '');
              return {
                title,
                subtitle,
              };
            },
          },
        },
      ],
      description: 'Orderable project page content: rich text, images, galleries, and Vimeo videos',
    },
  ],
}
