'use client'
import React, { useState, useEffect, useRef } from 'react';
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {cn} from '@/utilities/cn'
import { Loader2 } from "lucide-react"
//@ts-ignore
import Mark from 'mark.js'
interface SearchProps {
  setContent: any
}
type Item = { title: any; content: any }

const SearchComponent: React.FC<SearchProps> = ({ setContent }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [items, setItems] = useState<Item[]>([])
  const [active, setActive] = useState('')
  const [loader, setLoader] = useState(false)
  const marker = useRef({} as any)
  useEffect(() => {
    marker.current = new Mark<any>(document.querySelector('.mark-context'))
    return ()=>{
      setContent(null)
    }
  }, [])

  const handleSearch = async (event: any) => {
    if (searchTerm.length < 3) return
    setLoader((_) => true)
    const res = await fetch('/api/searchManual', {
      method: 'POST',
      body: JSON.stringify({ searchTerm }),
    }).then((it) => it.json())
    setItems((_) => res)
    setLoader((_) => false)
  }
  const clickSearchItem = (it: Item, idx: number) => {
    setActive((_) => it.title + idx)
    doMarking(null)
    setTimeout(() => {
      doMarking(it.content)
    }, 50);
  }
  const doMarking = (content: any) => {
      setContent((_:any) => content)
      setTimeout(() => {
        marker.current.unmark()
        marker.current.mark(searchTerm)
      }, 200)
  }
  return (
    <React.Fragment>
      <form className="flex mt-4 mb-2">
        <Input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search..."
        />
        <Button disabled={loader || searchTerm.length < 3} onClick={handleSearch} type="button">
          {loader && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Search
        </Button>
      </form>
      {items.map((it, idx) => (
        <div
          className={cn('cursor-pointer hover:bg-cyan-100', {
            'bg-cyan-400': active === it.title + idx,
          })}
          onClick={() => clickSearchItem(it, idx)}
          key={it.title + idx}
        >
          {it.title}
        </div>
      ))}
    </React.Fragment>
  )
}

export default SearchComponent
