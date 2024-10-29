import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const ProjectInfoBlock: Block = {
  slug: 'project-info',
  interfaceName: 'ProjectContent',
  fields: [
    
    {
      name: 'isReversed',
      type: 'checkbox',
      defaultValue:false
    },
    {
      name: 'projectTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'projectType',
      type: 'text',
      required: true,
    },
    {
      name: 'projectClient',
      type: 'text',
      required: true,
    },
    {
      name: 'projectDetail',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      required: true,
    },
    {
      name: 'keyFeatures',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
      ],
      required: true,
    },
    {
      name: 'projectScreenShot',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'technologies',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
      ],
      required: true,
    },
  ],
  labels: {
    plural: 'STL Project Content',
    singular: 'STL Project Content',
  },
}
