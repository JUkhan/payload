//@ts-nocheck
'use client'
import { Media } from '@/components/Media'
import { Career, Joblocation, Jobtype } from '@/payload-types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import Link from 'next/link'
import React from 'react'
type Props = {
  categories: string[]
  jobLocations: Joblocation[]
  jobTypes: Jobtype[]
}
type searchType = {
  keyword?: string
  category?: string
  jobType?: string
  jobLocation?: string
}
const CareerDoc = ({ docs, categories, jobLocations, jobTypes }: Props & { docs: Career[] }) => {
  const [jobs, setJobs] = React.useState(docs)
  const search = React.useCallback(
    (arg: searchType) => {
      let res = docs
      if (arg.keyword) {
        const keyward = arg.keyword.trim().toLowerCase()
        res = res.filter((it) => it.title.toLowerCase().includes(keyward))
      }
      if (arg.category) {
        res = res.filter((it) =>it.jobFeatures.category.split(',').map(it=>it.trim()).includes(arg.category))
      }
      if (arg.jobType) {
        res = res.filter((it) => it.jobTypes.id === arg.jobType)
      }
      if (arg.jobLocation) {
        res = res.filter((it) => it.jobLocations.id === arg.jobLocation)
      }
      setJobs(res)
    },
    [docs],
  ) // Added 'docs' to the dependency array
  return (
    <React.Fragment>
      <SearchCareer
        categories={categories}
        jobLocations={jobLocations}
        jobTypes={jobTypes}
        search={search}
      />
      <RenderDocs docs={jobs} />
    </React.Fragment>
  )
}

export default CareerDoc
const trimText = (data: any) => (data.length ? data[0].text : '')
const emptyState={keyword:'', category:'', jobType:'', jobLocation:''}
function SearchCareer({
  categories,
  jobTypes,
  jobLocations,
  search,
}: Props & { search: (afg: searchType) => void }) {
  const [hasSearch, setHasSearch] = React.useState(false)
  const [state, setState]=React.useState(emptyState)
  const handler = React.useCallback(
    (isRefresh: boolean) => {
      setHasSearch(!isRefresh)
      if (isRefresh) {
       search(emptyState)
       setState(emptyState)
        return
      }
      search(state)
    },
    [state, search],
  )
  const valueChange=React.useCallback((key, value)=>{
    setState(s=>({...s, [key]:value}))
  },[])
  return (
    <div className="relative text-center">
      <form className="container">
        <Input type="text" name="keyword" placeholder="keyword" value={state.keyword} onChange={ev=>valueChange('keyword', ev.target.value)} />
        <Select name="category" value={state.category} onValueChange={value=>valueChange('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
          {categories.map((it) => (<SelectItem key={it} value={it}>{it}</SelectItem>))}
          </SelectContent>
        </Select>
        <Select value={state.jobType} onValueChange={value=>valueChange('jobType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
          {jobTypes.map((it) => (<SelectItem key={it.id} value={it.id}>{it.title}</SelectItem>))}
          </SelectContent>
        </Select>
        <Select value={state.jobLocation} onValueChange={value=>valueChange('jobLocation', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
          {jobLocations.map((it) => (<SelectItem key={it.id} value={it.id}>{it.title}</SelectItem>))}
          </SelectContent>
        </Select>
        
        <Button onClick={() => handler(false)} type="button">
          Search
        </Button>
        {hasSearch && (
          <Button variant="destructive" onClick={() => handler(true)} type="button">
            Clear Result
          </Button>
        )}
      </form>
    </div>
  )
}

function RenderDocs({ docs }: { docs: Career[] }) {
  if (!docs.length) return <div className="text-center">No jobs found</div>
  return (
    <div className="container">
      {docs.map((it) => (
        <div
          key={it.id}
          className="block mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
        >
          <div className="flex  justify-between">
            <div className="flex items-center justify-center">
              <Media className="w-[40px] inline-block" resource={it.logo} />
              <span className="ml-4">{it.title} </span>
            </div>
            <Button asChild>
              <Link href={`/careers/${it.slug}`}>Apply Now</Link>
            </Button>
          </div>
          <div>
            <b>{it.jobTypes.title}</b> <b>{it.jobLocations.title}</b>
          </div>
          <div>{trimText(it.jobDetail?.root?.children[0]['children'])}</div>
        </div>
      ))}
    </div>
  )
}
