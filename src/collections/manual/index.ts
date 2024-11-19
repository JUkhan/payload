import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidatePage } from './hooks/revalidatePage'

import { SubMenuBlock, DocContent, DocContentWithTitle } from '@/blocks/SubMenuBlock/config'


import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { anyone } from '@/access/anyone'
export const Manuals: CollectionConfig = {
  slug: 'manuals',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone, //authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
        name: 'title',
        type: 'text',
        required: true,
    },
    {
      name: 'items',
      type: 'blocks',
      blocks: [SubMenuBlock, DocContent, DocContentWithTitle],
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date:{
          pickerAppearance:'dayAndTime'
        },
        position: 'sidebar',
      },
      hooks:{
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      }
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
  },
};
