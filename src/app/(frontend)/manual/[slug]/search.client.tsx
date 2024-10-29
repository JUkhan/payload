'use client'
import React, { useState } from 'react';
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {cn} from '@/utilities/cn'
import { Loader2 } from "lucide-react"
interface SearchProps {
  setContent: (any) => any
}
type Item={title:any, content:any}
const SearchComponent: React.FC<SearchProps> = ({setContent}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems]=useState<Item[]>([])
  const [active, setActive]=useState('')
  const [loader, setLoader]=useState(false)
  const handleSearch = async (event: any) => {
    if(searchTerm.length<3)return
    setLoader(_=>true)
    const res= await fetch('/api/searchManual', {
        method: 'POST',
        body: JSON.stringify({searchTerm}),
      }).then((it) => it.json())
      setItems(_=>res)
      setLoader(_=>false)
  };

  return (
    <React.Fragment>
    <form className='flex mt-4 mb-2'>
      <Input
        type="search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search..."
      />
      <Button disabled={loader||searchTerm.length<3} onClick={handleSearch} type="button">
      {loader &&<Loader2 className="mr-2 h-4 w-4 animate-spin" />} Search
      </Button>
    </form>
    {items.map((it, idx)=><div className={cn('cursor-pointer hover:bg-cyan-100', {'bg-cyan-400':active===it.title+idx})} onClick={()=>{setContent(it.content);setActive(_=>it.title+idx)}} key={it.title+idx}>{it.title}</div>)}
    </React.Fragment>
  );
};

export default SearchComponent;

