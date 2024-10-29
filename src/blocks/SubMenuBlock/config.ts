import type { Block } from 'payload'

//import { Content } from '@/blocks/Content/config'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import {HtmlBlock} from '@/blocks/HtmlBlock/config'
import { MarkdownBlock } from '../MarkdownBlock/config'

export const DocContent: Block = {
  slug: 'doc',
  interfaceName: 'DocContent',
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            BlocksFeature({ blocks: [Banner, Code, MediaBlock, HtmlBlock, MarkdownBlock] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      label: false,
      required: true,
    },
  ],
  labels: {
    plural: 'Content',
    singular: 'Content',
  },
}

export const DocContentWithTitle: Block = {
  slug: 'doc-title',
  interfaceName: 'DocContentTitle',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            BlocksFeature({ blocks: [Banner, Code, MediaBlock, HtmlBlock, MarkdownBlock] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      label: false,
      required: true,
    },
  ],
  labels: {
    plural: 'Content With Munu Title',
    singular: 'Content With Munu Title',
  },
}
// Define a type for the SubMenuBlock to avoid circular reference
export const SubMenuBlock: Block = {
  slug: 'submenu',
  interfaceName: 'SubMenu',
  fields: [
    {
      type: 'group',
      name: 'subMenu',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'items',
          type: 'blocks',
          blocks: [
            DocContent,
            DocContentWithTitle,
            {
              labels: {
                plural: 'Sub Menu lavel2',
                singular: 'Sub Menu lavel2',
              },
              slug: 'lavel2',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'items',
                  type: 'blocks',
                  blocks: [
                    DocContent,
                    DocContentWithTitle,
                    {
                      labels: {
                        plural: 'Sub Menu lavel3',
                        singular: 'Sub Menu lavel3',
                      },
                      slug: 'lavel3',
                      fields: [
                        {
                          name: 'title',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'content',
                          type: 'richText',
                          editor: lexicalEditor({
                            features: ({ rootFeatures }) => {
                              return [
                                ...rootFeatures,
                                HeadingFeature({
                                  enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'],
                                }),
                                BlocksFeature({ blocks: [Banner, Code, MediaBlock, HtmlBlock, MarkdownBlock] }),
                                FixedToolbarFeature(),
                                InlineToolbarFeature(),
                                HorizontalRuleFeature(),
                              ]
                            },
                          }),
                          label: false,
                          required: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ], // Use the type reference here
          required: true,
        },
      ],
    },
  ],
  labels: {
    plural: 'Sub Menu',
    singular: 'Sub Menu',
  },
}
