'use client'
import React from 'react'
import type { HtmlContent } from '@/payload-types'


export const HtmlBlock: React.FC<HtmlContent> = ({ content }) => {
  return (
    <div dangerouslySetInnerHTML={{__html: content}} />
  )
}
