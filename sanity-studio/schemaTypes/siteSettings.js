export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'menuLinks',
      title: 'Projects Dropdown Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'menuLink',
          title: 'Menu Link',
          fields: [
            {
              name: 'id',
              title: 'ID',
              type: 'string',
              description: 'Unique key used by the frontend (for example: archive)',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'href',
              title: 'Link URL',
              type: 'string',
              description: 'Use /path for internal links or https://... for external links',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'order',
              title: 'Display Order',
              type: 'number',
              description: 'Lower numbers are shown first.',
            },
            {
              name: 'external',
              title: 'Open In New Tab',
              type: 'boolean',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href',
              order: 'order',
            },
            prepare(selection) {
              const order = typeof selection.order === 'number' ? selection.order : 'n/a'
              return {
                title: selection.title,
                subtitle: `[${order}] ${selection.subtitle || ''}`,
              }
            },
          },
        },
      ],
      description: 'Additional links shown at the bottom of the Projects dropdown.',
    },
  ],
};