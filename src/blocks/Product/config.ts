import type { Block } from 'payload'

export const ProductBlock: Block = {
  slug: 'products',
  interfaceName: 'ProductList',
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
        },
      ],
    },
  ],
  labels: {
    plural: 'STL Product',
    singular: 'STL Product',
  },
}
