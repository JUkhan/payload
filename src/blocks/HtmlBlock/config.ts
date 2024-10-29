import type { Block } from 'payload'



export const HtmlBlock: Block = {
  slug: 'html-content',
  interfaceName: 'HtmlContent',
  fields: [
    {
        name:'content',
        type:'textarea',
        required:true
    }
  ],
  labels: {
    plural: 'Html Content',
    singular: 'Html Content',
  },
}
