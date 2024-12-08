
import React from 'react';
import PageClient from './page.client'
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
    limit: 0,
    overrideAccess: true,
  })

  return result.docs.map((it) => ({
    name: it.name,
    email: it.email
  }))
}
const MakeComponent = async () => {
  const users = await allUsers()
  const {user}= await getMeUser()
  return <div>
    <PageClient users={users} user={user} />
  </div>;
};

export default MakeComponent;


