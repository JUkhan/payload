import React from 'react'
import type { ProjectContent } from '@/payload-types'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/cn'
import ProjectType from './ProjectType'
import ProjectClient from './ProjectClient'
import {CircleCheckIcon} from 'lucide-react'
import {Media} from '@/components/Media'

export const ProjectInfoBlock: React.FC<ProjectContent> = ({
  projectTitle,
  projectType,
  projectClient,
  projectScreenShot,
  keyFeatures,
  projectDetail,
  technologies,
  logo,
  isReversed,
}) => {
  const bgColors = ['bg-red-500', 'bg-green-500', 'bg-lime-500', 'bg-orange-500']
  const left = (
    <div>
      <Media resource={projectScreenShot}/>
      <div className="font-bold my-4 text-2xl">Technologies</div>
      <div className="flex flex-wrap gap-4">
        {technologies.map((it, i) => (
          <span className={cn('border rounded-[1em] py-1 px-4', bgColors[i % 4])} key={it.name}>
            {it.name}
          </span>
        ))}
      </div>
    </div>
  )
  
  const right = (
    <div>
      <div className='flex'>
      {logo && <Media resource={logo}/>}
      <div className="font-bold text-3xl mb-14">{projectTitle}</div>
      </div>
      
      <div className="grid grid-cols-2 my-14">
        <div className="flex">
          <ProjectType />
          <p className='pl-4'>{projectType}</p>
        </div>
        <div className='flex'>
        <ProjectClient />
        <p className='pl-4'>{projectClient}</p>
        </div>
      </div>
      <RichText className="ml-0 max-w-[48rem]" content={projectDetail} enableGutter={false} />
      <div className="font-bold my-4 text-2xl">Key Features</div>

      {keyFeatures.map((it, i) => (
        <div className="font-bold py-2" key={i}>
          <CircleCheckIcon className='inline-block mr-4' color='#ff9a2d'/> <span>{it.name}</span>
        </div>
      ))}
    </div>
  )
  
  return (
    <div className= 'py-8' style={{backgroundColor:isReversed?'#edfaff':'white'}} >
      <div className="p-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {isReversed ? right : left}
          {isReversed ? left : right}
        </div>
      </div>
    </div>
  )
}
