//@ts-nocheck
import type { Metadata } from 'next'

import {getCachedGlobal} from '@/utilities/getGlobals'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { draftMode, headers } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Header, Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import { formatDateTime } from '@/utilities/formatDateTime'
import ManualCom from './page.client'

import dayjs from 'dayjs'
//import PageClient from './page.client'
type Menu={title:string, content?:any, children?:Menu[], expand?:boolean}
export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })
  const careers = await payload.find({
    collection: 'manuals',
    draft: false,
    limit: 1000,
    overrideAccess: false,
  })

  return careers?.docs?.map(({ slug }) => slug)
}

export default async function Post({ params: { slug = '' } }) {
  const url = '/manual/' + slug
  const manual = await queryManualBySlug({ slug })

  const footer: Header = await getCachedGlobal('header')()

  const navItems = footer?.navItems?.filter(it=>it.link.parent==='Manual').map(it=>({title:it.link.label, url:it.link.url, children:[]}))
 
 
  if (!manual) return <PayloadRedirects url={url} />
  var items=manual.items?.reduce((acc, block)=>{
    switch (block.blockType) {
      case 'doc-title':
        acc.push({title:block.title, content:block.content})
        break;
      case 'submenu':
        const item:Menu={title:block.subMenu.title, expand:false, children:[]}
        block.subMenu.items?.reduce((subAcc, subLayout)=>{
          switch (subLayout.blockType) {
            case 'doc-title':
              subAcc?.push({title:subLayout.title, content: subLayout.content})
              break;
            case 'lavel2':
              const item2:Menu={title:subLayout.title, children:[]}
              subLayout.items?.reduce((acc2, lay2)=>{
                switch (lay2.blockType) {
                  case 'doc-title':
                    acc2?.push({title:lay2.title, content:lay2.content})
                    break;
                
                  default:
                    break;
                }
                return acc2
              }, item2.children)
              subAcc?.push(item2)
            default:
              break;
          }
          return subAcc
        }, item.children)
        acc.push(item)
      default:
        break;
    }
    return acc;
  }, [] as Menu[])
  
  const found=navItems?.find(it=>it.url?.endsWith(slug))
  if(found){
    found.children=items
    found.expand=true
  }
  return (
    <article className="container">
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />
      
      <ManualCom menuList={navItems}/>
      
    </article>
  )
}

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const manual = await queryManualBySlug({ slug })

  return generateMeta({ doc: manual })
}

const queryManualBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = draftMode()

  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'manuals',
    draft,
    limit: 4,
    overrideAccess: true,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
