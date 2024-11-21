import Starter from './Startet'
//import { getProductUsers } from "@/data-access/services/user.service";
import { ChatGroup, ChatMessage } from '@/payload-types'
//import { getCachedGlobal } from "@/payload/utilities/getGlobals";
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { unstable_cache, revalidateTag } from 'next/cache'
import { Metadata } from 'next'
//import { PayloadRedirects } from '@/components/PayloadRedirects'
import { getMeUser } from '@/utilities/getMeUser'

import configPromise from '@payload-config'

async function allUsers() {
  'use server'
  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'users',
    limit: 1000,
    overrideAccess: true,
  })

  return result.docs.map((it) => ({
    value: it.email,
    email: it.email,
    label: it.name,
  }))
}

async function createGroup(group: any): Promise<[string | null, ChatGroup | null]> {
  'use server'
  const payload = await getPayloadHMR({ config: configPromise })

  const found = await payload.find({
    collection: 'chat-group',
    limit: 1,
    where: {
      groupName: { equals: group.groupName },
    },
  })
  if (found.docs && found.docs.length == 1) {
    return [`Group name '${group.groupName}' already exist`, null]
  }
  const result = await payload.create({
    collection: 'chat-group',
    data: group,
  })

  return [null, result]
}

const ChatPage = async () => {
  const users = await allUsers()
  const groups = await getChatGroups()
  const {user}= await getMeUser()
  console.log(user)
  return (
    <Starter
      loggedInUser={user}
      users={users}
      groups={groups}
      getMessages={getGroupMessages}
      createGroup={createGroup}
    />
  )
}

export default ChatPage

async function getChatGroups() {
  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'chat-group',
    limit: 1000,
    overrideAccess: true,
  })

  return result.docs || []
}

async function getGroupMessages(groupId: string) {
  'use server'

  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'chat-message',

    limit: 1000,
    where: {
      groupId: { equals: groupId },
    },
    sort: 'createdAt', 
    overrideAccess: true,
  })

  return result.docs || []
}
