import type { Block } from 'payload'



export const MarkdownBlock: Block = {
  slug: 'markdown-content',
  interfaceName: 'MarkdownContent',
  fields: [
    {
        name:'content',
        type:'textarea',
        required:true
    }
  ],
  labels: {
    plural: 'Markdown Content',
    singular: 'Markdown Content',
  },
}
