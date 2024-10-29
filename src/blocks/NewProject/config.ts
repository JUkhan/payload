import type { Block } from 'payload'



export const NewProjectBlock: Block = {
  slug: 'new-project',
  interfaceName: 'NewProject',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'buttonText',
      type: 'text',
      required: true,
    },
    {
      name: 'bgImg',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
  ],
  labels: {
    plural: 'STL Offer New Project',
    singular: 'STL Offer New Project',
  },
}
