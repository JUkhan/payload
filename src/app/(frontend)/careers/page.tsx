import type { Metadata } from 'next/types'


import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'

import { RenderHero } from '@/heros/RenderHero'


import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import RenderCareer from './render.career'
export const dynamic = 'force-static'
export const revalidate = 600

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = draftMode()

  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: true,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const trimText=(data:any)=>data.length?data[0].text:''
const CareersPage = async () => {
  const payload = await getPayloadHMR({ config: configPromise })

  const careers = await payload.find({
    collection: 'careers',
    depth: 1,
    limit: 50,
  })

  const jobLocations = await payload.find({
    collection: 'joblocations',
    depth: 1,
    limit: 50,
  })
  const jobTypes = await payload.find({
    collection: 'jobtypes',
    depth: 1,
    limit: 50,
  })
  const categories=Array.from(careers.docs.reduce((acc, record)=>{
    record.jobFeatures.category.split(',').forEach(val=>acc.add(val.trim()))
    return acc;
  }, new Set<string>()))
  //const docs=careers.docs.map(it=>({id:it.id, category:it.jobFeatures.category, title:it.title, slug:it.slug, logo: it.logo, des:trimText(it.jobDetail?.root?.children[0]['children'])}))
  const page = await queryPageBySlug({slug:'careers'})
 
  if (!careers) return null
  return (
    <>
    <RenderHero {...page.hero} title={page.title} subTitle={page.subTitle??''} />
    <RenderCareer docs={careers.docs!} categories={categories} jobTypes={jobTypes.docs} jobLocations={jobLocations.docs} />
    
    </>
  )
}

export default CareersPage

export function generateMetadata(): Metadata {
  return {
    title: `Careers`,
  }
}

