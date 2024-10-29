import React from 'react'
import type { ProjecstTitle } from '@/payload-types'
import Image from 'next/image'

export const HomeBlock: React.FC<ProjecstTitle> = ({ title }) => {
  return (
    <div className="text-center">
        Home Content
        <Image width={700} height={300} src="/media/project1.webp" alt="Careers Image" />
    </div>
  )
}
