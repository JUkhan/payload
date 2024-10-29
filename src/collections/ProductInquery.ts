import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const ProductInquery: CollectionConfig = {
  slug: 'product-inqueries',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
        name: 'email',
        type: 'text',
        required: true,
    },
    {
        name: 'phone',
        type: 'text',
    },
    {
        name: 'company',
        type: 'text',
    },
    {
        name: 'jobTile',
        type: 'text',
    },
    {
        name: 'queryType',
        type: 'text',
        required: true,
    },
    {
        name: 'product',
        type: 'text',
        required: true,
    },
    {
        name: 'message',
        type: 'text',
    },
  ],
}

export default ProductInquery
