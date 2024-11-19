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
import { unstable_cache } from 'next/cache'

import dayjs from 'dayjs'
//import PageClient from './page.client'
type Menu={title:string, content?:any, children?:Menu[], expand?:boolean}
/*export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })
  const manuals = await payload.find({
    collection: 'manual-geoswmm',
    draft: false,
    limit: 1000,
    overrideAccess: false,
  })

  return manuals?.docs?.map(({ slug }) => slug)
}*/

export const metadata: Metadata = {
  title: "GeoSWMM User Manual | Utilian",
  description: "View our user manual to better understand the ins-and-outs of GeoSWMM and its many features.",
};

const getItems=(manual: ManualGeoswmm)=> manual?.items?.reduce((acc, block)=>{
    switch (block.blockType) {
      case 'doc':
        acc.push({title:'self', content:block.content})
        break
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
  }, [] as Menu[])??[]


const PageComponent = async ({ params, searchParams }:any) => {
  const { q } = await searchParams
  const { slug } = await params
  const manual = await queryManualBySlug(slug )()
  console.log(manual)
  const menu: Manus = await getCachedGlobal('header')()
  const navItems = menu?.navItems?.filter(it=>it.link.parent==='Manual').map(it=>({title:it.link.label, url:it.link.url, children:[], directContent:it.link.directContent}))??[]
  const topics = getItems((await queryManualBySlug('topics' )()))
  let found=navItems.find(it=>it.url?.endsWith(slug)) as any
  if(found){
    const items=getItems(manual)
    if(found.directContent){
      found.content=items[0].content
      found.active=found.title
    } else{
    found.children=items
    found.expand=true
    if(q){
       bindMenuWithQueryStr(q.split('/'), found)
    }else{
      items[0].active=items[0].title
    }
    }
  }
  return (
    <article className="p-4">
      {/* <PayloadRedirects disableNotFound url={url} /> */}
      <ManualCom menuList={navItems as any} topics={topics as any}/>
    </article>
  )
};

export default PageComponent;

function bindMenuWithQueryStr( arr:string[], item?:Menu,){
    if(item && arr.length>0){
      item.expand=true
      if(arr.length==1){
        const t=item.children?.find(it=>it.title===arr[0])
        if(t)t.active=arr[0]
      }
      bindMenuWithQueryStr(arr.slice(1), item.children?.find(it=>it.title===arr[0]))
    }
}

const queryManualBySlug =(slug: string ) => unstable_cache(async () => {
    const { isEnabled:draft } = await draftMode()
  
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
  
    return result.docs?.[0] || []
  },[slug],{tags:[`${slug}`]})
  