import React from 'react'
import type { NewProject } from '@/payload-types'
import { Button } from '@/components/ui/button'
import {Media} from '@/components/Media'
import Link from 'next/link'

export const NewProjectBlock: React.FC<NewProject> = ({ title, buttonText, bgImg }) => {
  
  return (
    <div className="relative flex justify-center items-center text-white">
      <div className="absolute z-10 text-center">
        <div className="text-3xl font-bold text-white mb-8">{title}</div>
        <Button asChild variant='secondary'>
          <Link href="/contact-us">{buttonText}</Link>
        </Button>
      </div>

      <div className="select-none">
        <Media resource={bgImg}/>
      </div>
    </div>
  )
}
