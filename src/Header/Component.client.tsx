'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { Media } from '@/components/Media'
import {setState} from '@/components/chat/state'

interface HeaderClientProps {
  header: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header }) => {
  useEffect(()=>{
    setState({toggleWindow:false})
  })
  return (
    <header
      className="container relative z-20 py-8 flex justify-between"
    >
      <Link href="/">
        <Media resource={header.logo}/>
      </Link>
      <HeaderNav header={header} />
      
    </header>
  )
}
