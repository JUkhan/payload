import { CollectionConfig } from 'payload'
import { currentUserOrSuperAdmin } from "@/payload/access/currentUserOrSuperAdmin";
import { slugField } from '@/payload/fields/slug'
import { SubMenuBlock, DocContent, DocContentWithTitle } from '@/blocks/SubMenuBlock/config'
//import { revalidatePage } from './hooks/revalidatePage';
import { populatePublishedAt } from './manual/hooks/populatePublishedAt';
import {
    BlocksFeature,
    lexicalEditor,
  } from '@payloadcms/richtext-lexical'

  import { MediaBlock } from '@/blocks/MediaBlock/config'
  import {HtmlBlock} from '@/blocks/HtmlBlock/config'
  import { MarkdownBlock } from '@/blocks/MarkdownBlock/config'
  
export const Posts: CollectionConfig = {
  slug: "posts",
  access: {
    create: currentUserOrSuperAdmin,
    delete: currentUserOrSuperAdmin,
    read: ()=>true,
    update: currentUserOrSuperAdmin,
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
        name:'description',
        type:'text',
        required:false
    },
    {
        name: 'media',
        type: 'upload',
        relationTo: 'media',
        required: false,
    },
    {
        name: 'authorId',
        type: 'text',
        required: false,
    },
    {
        name: 'authorName',
        type: 'text',
        required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, BlocksFeature({ blocks: [MediaBlock, HtmlBlock, MarkdownBlock] }),]
        },
      }),
      label: false,
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
    //afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
  },
};
