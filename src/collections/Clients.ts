import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const Clients: CollectionConfig = {
  slug: 'clients',
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
        required: true,
    },
    {
        name: 'company',
        type: 'text',
        required: true,
    },
    {
        name: 'message',
        type: 'text',
        required: true,
    },
  ],
}

export default Clients
