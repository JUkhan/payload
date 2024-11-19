import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const PostComments: CollectionConfig = {
  slug: 'post-comments',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  
  fields: [
    {
        name:'postId',
        type:'text',
        //relationTo:'posts',
        required:true
    },
    {
        name: 'userId',
        type: 'text',
        required: false,
    },
    {
        name: 'userName',
        type: 'text',
        required: true,
    },
    {
        name:'comment',
        type:'text',
        required:true
    },
    {
        name:'replyId',
        type:'text',
        //relationTo:'posts',
        required:false
    },
  ],
}

export default PostComments
