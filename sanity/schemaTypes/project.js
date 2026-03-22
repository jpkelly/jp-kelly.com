export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'id',
      title: 'ID',
      type: 'string',
      validation: (Rule) => Rule.required().unique(),
      description: 'Unique identifier for the project (used in URLs)',
    },
    {
      name: 'path',
      title: 'Path',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'URL path for the project (e.g., /projects/myproject)',
    },
    {
      name: 'menuLabel',
      title: 'Menu Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Label displayed in navigation menu',
    },
    {
      name: 'routeKey',
      title: 'Route Key',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Key used internally for routing',
    },
    {
      name: 'cardTitle',
      title: 'Card Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Title displayed on gallery card',
    },
    {
      name: 'cardText',
      title: 'Card Text',
      type: 'text',
      validation: (Rule) => Rule.required(),
      description: 'Description displayed on gallery card',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which projects appear in gallery',
    },
    {
      name: 'thumbnails',
      title: 'Thumbnails',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      description: 'Thumbnail images for gallery',
    },
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Title for search engines and social media',
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      description: 'Description for search engines and social media',
    },
    {
      name: 'seoImage',
      title: 'SEO Image',
      type: 'image',
      description: 'Image for Open Graph / Twitter card',
    },
    {
      name: 'aliases',
      title: 'URL Aliases',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
      description: 'Alternative URLs that redirect to this project',
    },
    {
      name: 'content',
      title: 'Page Content (MDX)',
      type: 'text',
      description: 'Markdown/MDX content for the project detail page',
    },
  ],
}
