import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

import type { Manual } from '@/payload-types'
type ManualGeoswmmWithStatus = Manual & { _status: 'published' | 'draft' | 'archived' }
export const revalidatePage: CollectionAfterChangeHook<ManualGeoswmmWithStatus> = ({
  doc,
  previousDoc,
  
  req: { payload },
}) => { 
  revalidateTag(`${doc.slug}`)
  return doc
}
