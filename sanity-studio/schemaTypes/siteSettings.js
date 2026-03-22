import defaultMenuLinks from '../../src/content/menuLinks.json'

function buildSeedMenuLinks() {
  if (!Array.isArray(defaultMenuLinks)) {
    return []
  }

  return defaultMenuLinks
    .map((link) => {
      if (!link || typeof link !== 'object') {
        return null
      }

      const id = typeof link.id === 'string' ? link.id.trim() : ''
      const label = typeof link.label === 'string' ? link.label.trim() : ''
      const href = typeof link.href === 'string' ? link.href.trim() : ''

      if (!id || !label || !href) {
        return null
      }

      return {
        id,
        label,
        href,
        order: Number.isFinite(Number(link.order)) ? Number(link.order) : null,
        external: Boolean(link.external),
      }
    })
    .filter(Boolean)
}

const seedMenuLinks = buildSeedMenuLinks()

export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  initialValue: () => ({
    menuLinks: seedMenuLinks.map((link) => ({...link})),
  }),
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
  fields: [
    {
      name: 'menuLinks',
      title: 'Projects Dropdown Links',
      type: 'array',
      initialValue: () => seedMenuLinks.map((link) => ({...link})),
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