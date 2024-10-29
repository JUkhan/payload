import React from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'


export const ProjectHero: React.FC<Page['hero']&{title:string, subTitle:string}> = ({ links, media, richText, title, subTitle }) => {
  console.log('RT',richText)
  return (
    <>
      <div className="relative flex justify-center items-center text-white">
        <div className="absolute z-10 text-center">
          <div className="text-3xl font-bold text-yellow-400">{title}</div>
           
          <div className='inline-block border border-yellow-400 w-[100px]'></div>
           
          <div className="text-lg mt-2">{subTitle}</div>
        </div>

        <div className="h-[400px] select-none">
          {media && typeof media === 'object' && (
            <React.Fragment>
              <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
              {/* <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />  */}
            </React.Fragment>
          )}
        </div>
      </div>
      {richText && (
        <div className="py-8 bg-gray-100">
          <RichText className="container" content={richText} enableGutter={false} />
        </div>
      )}
    </>
  )
}
