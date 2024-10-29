
import React from 'react'
import type { MarkdownContent } from '@/payload-types'
import MarkdownView from 'react-showdown';


export const MarkdownBlock: React.FC<MarkdownContent> = ({ content }) => {
  return (
    <MarkdownView
    markdown={content}
    options={{ tables: true, emoji: true }}
  />
  )
}
