import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "../access/isSuperAdmin";
import { currentUserOrSuperAdmin } from "../access/currentUserOrSuperAdmin";

export const PostComments: CollectionConfig = {
  slug: "post-comments",
  access: {
    create: () => true,
    read: () => true,
    delete: isSuperAdmin,
    update: currentUserOrSuperAdmin,
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
};
