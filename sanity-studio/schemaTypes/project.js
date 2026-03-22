import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

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
      media: 'thumbnails.0',
    },
    prepare(selection) {
      const title = selection.menuLabel || selection.cardTitle || selection.id || 'Untitled Project'
      const subtitleBase = selection.cardTitle && selection.cardTitle !== title ? selection.cardTitle : selection.id
      const subtitle = selection.path
        ? `${subtitleBase ? `${subtitleBase} · ` : ''}${selection.path}`
        : subtitleBase || ''

      return {
        title,
        subtitle,
        media: selection.media,
      }
    },
  },
  fields: [
    orderRankField({ type: 'project', hidden: true }),
    { name: 'id', title: 'ID', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'path', title: 'Path', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'menuLabel', title: 'Menu Label', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'routeKey', title: 'Route Key', type: 'string', validation: (Rule) => Rule.required() },
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
      name: 'videos',
      title: 'Vimeo Videos',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'vimeoVideo',
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
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'url',
            },
            prepare(selection) {
              const title = selection.title || 'Vimeo Video';
              return {
                title,
                subtitle: selection.subtitle,
              };
            },
          },
        },
      ],
      description: 'Reference Vimeo videos used in this project page',
    },
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
      ],
      description: 'Rich text and images for project detail page',
    },
  ],
}
