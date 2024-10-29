'use client'
import React from 'react'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/cn'
type Menu = { title: string; content?: any; url?:string, children?: Menu[]; expand?: boolean }
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import {
  Card,
  CardContent,
 
} from '@/components/ui/card'
import SearchComponent from './search.client'
import {useRouter} from 'next/navigation'
const MenuItem: React.FC<{
  item: Menu
  setContent: (any) => any
  active: string
  setActive: (string) => any
}> = ({ item, setContent, active, setActive }) => {
  const router = useRouter()
  const [isExpand, setExpand] = React.useState(item.expand??false)

  const clickHandler = (ev: any) => {
    ev.stopPropagation()
    if(item.url){
      router.push(item.url)
    }
    setContent(item.content)
    if (item.children) {
      setExpand((prev) => !prev)
    }
    setActive((pre) => item.title)
  }
  return (
    <li onClick={clickHandler} className='cursor-pointer'>
      {item.children && (isExpand ? '▼ ' : '▶ ')}{' '}
      <span className={cn('hover:bg-cyan-100', {'bg-cyan-400':active===item.title})}>{item.title}</span>
      {isExpand && item.children && (
        <menu className="ml-4">
          {item.children.map((it, idx) => (
            <MenuItem
              key={idx}
              item={it}
              setContent={setContent}
              active={active}
              setActive={setActive}
            />
          ))}
        </menu>
      )}
    </li>
  )
}
const ManualComponent: React.FC<{ menuList: Menu[] }> = ({ menuList }) => {
  const [content, setContent] = React.useState(null)
  const [active, setActive] = React.useState('')

  return (
    <div className="inline-flex">
      <Tabs defaultValue="manual" className="min-w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <Card>
            <CardContent>
              <menu className="mt-4">
                {menuList.map((it, idx) => (
                  <MenuItem
                    setContent={setContent}
                    key={idx}
                    item={it}
                    active={active}
                    setActive={setActive}
                  />
                ))}
              </menu>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="search">
          <Card>
            <CardContent>
            <SearchComponent setContent={setContent}/>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {content && <RichText className="pl-8" content={content} enableGutter={false} />}
    </div>
  )
}

export default ManualComponent
