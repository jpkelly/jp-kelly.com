export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'id', title: 'ID', type: 'string', validation: (Rule) => Rule.required().unique() },
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
        { type: 'image', options: { hotspot: true } },
      ],
      description: 'Rich text and images for project detail page',
    },
  ],
}
