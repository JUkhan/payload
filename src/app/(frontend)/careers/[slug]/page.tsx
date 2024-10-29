//@ts-nocheck
import type { Metadata } from 'next'

import CvUploader from '@/components/CvUploader'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { draftMode, headers } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import {formatDateTime} from '@/utilities/formatDateTime'

import dayjs from 'dayjs'
//import PageClient from './page.client'

export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })
  const careers = await payload.find({
    collection: 'careers',
    draft: false,
    limit: 1000,
    overrideAccess: false,
  })

  return careers?.docs?.map(({ slug }) => slug)
}

export default async function Post({ params: { slug = '' } }) {
  const url = '/posts/' + slug
  const career = await queryCareerBySlug({ slug })

  if (!career) return <PayloadRedirects url={url} />
  const {category, vacancies, experience,salaty}=career.jobFeatures
  return (
    <article className="container">
      {/* <PageClient /> */}

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />
      <h3 className="text-3xl">{career.title}</h3>
      <RichText className="" content={career.jobDetail} enableGutter={false} />

      <h3 className='text-yellow-400 font-bold'>Job Location</h3>
      <div>{career.jobLocations.title}</div>

      <h3 className='text-yellow-400 font-bold'>Job Responsibilities</h3>
      <RichText className="" content={career.jobResponsibilities} enableGutter={false} />

      <h3 className='text-yellow-400 font-bold'>Educational Requirements</h3>
      <RichText className="" content={career.educationalRequirements} enableGutter={false} />

      <h3 className='text-yellow-400 font-bold'>Experience Requirements</h3>
      <RichText className="" content={career.experienceRequirements} enableGutter={false} />

      <h3 className='text-yellow-400 font-bold'>Job Requirements</h3>
      <RichText className="" content={career.jobRequirements} enableGutter={false} />

      <h3 className='text-yellow-400 font-bold'>Compensation and other benefits</h3>
      <RichText className="" content={career.OtherBenefits} enableGutter={false} />

      {career.calturalValues && (
        <div>
          <h3 className='text-yellow-400 font-bold'>Caltural Values</h3>
          <RichText className="" content={career.calturalValues} enableGutter={false} />
        </div>
      )}
      <h3 className='text-yellow-400 font-bold'>Application Deadline</h3>
      <div>{dayjs(career.applicationDeadline).format('DD MMMM, YYYY')}</div>

      <h3 className='text-yellow-400 font-bold'>Expected Date of Commencement of Service</h3>
      <div>{dayjs(career.expectedDateOfCommencementOfService).format('MMMM, YYYY')}</div>

      <h3 className='text-yellow-400 font-bold'>Important Notes</h3>
      <RichText className="" content={career.importantNotes} enableGutter={false} />

      <h3 className='text-yellow-400 font-bold'>Apply procedure</h3>
      <RichText className="" content={career.applyProcedure} enableGutter={false} />

      <h3 className='text-yellow-400 font-bold'>Job Features</h3>
      <div className='flex gap-4'>
      <div className='card'>
        <div>Job Categoty</div>
        <div>{category}</div>
      </div>
      <div className='card'>
        <div>No. of Vacancies</div>
        <div>{vacancies}</div>
      </div>
      <div className='card'>
        <div>Experience</div>
        <div>{experience}</div>
      </div>
      <div className='card'>
        <div>Salary</div>
        <div>{salaty}</div>
      </div>
      </div>
      <CvUploader />
    </article>
  )
}

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const career = await queryCareerBySlug({ slug })

  return generateMeta({ doc: career })
}

const queryCareerBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = draftMode()

  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'careers',
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
