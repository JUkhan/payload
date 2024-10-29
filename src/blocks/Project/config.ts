import type { Block } from 'payload'



export const ProjectBlock: Block = {
  slug: 'project',
  interfaceName: 'Projecst title',
  fields: [
    {
      name: 'title',
      label:'Projects Title',
      type: 'text',
      defaultValue: 'Project Examples',
      required:true,
    }
  ],
  labels: {
    plural: 'STL Projects Title',
    singular: 'STL Projects Title',
  },
}
