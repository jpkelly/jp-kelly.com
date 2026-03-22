export default {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'introText',
      title: 'Introduction Text',
      type: 'text',
      description: 'Main introduction paragraph (appears in the first paragraph slot)',
    },
    {
      name: 'bodyContent',
      title: 'Body Content',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Text',
              type: 'text',
            },
          ],
        },
      ],
      description: 'Additional paragraphs of about page content',
    },
    {
      name: 'siteBuiltText',
      title: 'Site Built Text',
      type: 'string',
      initialValue: 'This site was originally built by hand using React',
      description: 'Main text about how site was built (React logo will be inserted after this)',
    },
    {
      name: 'coPilotText',
      title: 'Copilot Text',
      type: 'string',
      initialValue: 'Complete refactoring done with Copilot.',
      description: 'Additional text about Copilot work',
    },
    {
      name: 'toolsList',
      title: 'Tools List',
      type: 'text',
      description: 'Comma-separated list of tools and technologies',
    },
    {
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
}
