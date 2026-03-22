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
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'bio',
      title: 'Bio Content',
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
      ],
      description: 'Main about-page text. Supports hyperlinks.',
    },
    {
      name: 'builtByText',
      title: 'Site Built Line',
      type: 'string',
      initialValue: 'This site was originally built by hand using React',
    },
    {
      name: 'copilotText',
      title: 'Copilot Line',
      type: 'string',
      initialValue: 'Complete refactoring done with Copilot.',
    },
    {
      name: 'codeLinkText',
      title: 'Code Link Text',
      type: 'string',
      initialValue: 'Here is the code.',
    },
    {
      name: 'codeLinkUrl',
      title: 'Code Link URL',
      type: 'url',
      initialValue: 'https://github.com/jpkelly/jp-kelly.com',
      validation: (Rule) => Rule.uri({ allowRelative: false, scheme: ['http', 'https'] }),
    },
    {
      name: 'toolsHeading',
      title: 'Tools Heading',
      type: 'string',
      initialValue: 'Here are a few of my favorite tools:',
    },
    {
      name: 'toolsList',
      title: 'Tools List',
      type: 'text',
      description: 'Comma-separated tools list',
    },
  ],
}
