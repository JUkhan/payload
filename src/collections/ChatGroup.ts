import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'


export const ChatGroup: CollectionConfig = {
  slug: "chat-group",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: "groupName",
  },
  fields: [
    {
      name: "groupName",
      type: "text",
      required: true,
    },
    {
      name: "isPrivate",
      type: "checkbox",
      defaultValue: false,
      required: true,
    },
    {
      name: "users",
      type: "array",
      fields: [
        {
          name: "userId",
          type: "text",
          required:true
        },
        {
            name: "name",
            type: "text",
        },
        {
            name: "email",
            type: "text",
        },
      ],
      required: false,
    },
  ],
};

export const ChatMessage: CollectionConfig = {
  slug: "chat-message",
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: "groupId",
  },
  fields: [
    {
      name: "groupId",
      type: "text",
      required: true,
    },
    {
      name: "userName",
      type: "text",
      required: true,
    },
    {
      name: "message",
      type: "text",
      required: true,
    },
  ],
};
