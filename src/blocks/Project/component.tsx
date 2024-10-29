import React from 'react'
import type { ProjecstTitle } from '@/payload-types'

export const ProjectBlock: React.FC<ProjecstTitle> = ({ title }) => {
  return (
    <div className="text-center my-8">
        <div className="text-4xl font-bold text-black-400">{title}</div>
           
        <div className='inline-block border border-yellow-400 w-[100px]'></div>
    </div>
  )
}
