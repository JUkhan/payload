'use client'
import React from 'react'
import type { ProjecstTitle } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {cn} from '@/utilities/cn'
type Response={status:number, error: Record<string, string>}
export const ContactUsBlock: React.FC<ProjecstTitle> = ({ title }) => {
  const formRef = React.useRef<HTMLFormElement>(null)
  const [state, setState]=React.useState({status:0, error:{}} as Response)
  const submitHandler=React.useCallback(async ()=>
    setState(await fetch('/api/client', {
      method: 'POST',
      body: new FormData(formRef.current!),
    }).then(it=>it.json())), [])
    
  return (
    <div className="container  grid grid-cols-1 gap-12 md:grid-cols-2">
      <div>Left Content</div>
      <div>
        <div>Let&apos;s Discuss Your Project</div>
        <div>Please provide the following details and our team will get back to you soon.</div>
        {state.status==1 && <div>
          <ul>
            {Object.keys(state.error).map(it=><li className='text-yellow-400' key={it}>{state.error[it]}</li>)}
          </ul>
        </div>}
        {state.status in [0,1] && <form ref={formRef}>
          <div className="flex gap-4 p-4">
            <Input className={cn({'border-red-700':state.error['name']})} type="text" name="name" placeholder="Your Name" />
            <Input className={cn({'border-red-700':state.error['email']})} type="text" name="email" placeholder="Your Email" />
          </div>
          <div className="flex gap-4 p-4">
            <Input className={cn({'border-red-700':state.error['phone']})} type="text" name="phone" placeholder="Phone Number" />
            <Input className={cn({'border-red-700':state.error['company']})} type="text" name="company" placeholder="Company Name" />
          </div>
          <div className="flex gap-4 p-4">
            <Textarea className={cn({'border-red-700':state.error['message']})} rows={10} name="message" placeholder="Your Message"></Textarea>
          </div>
          <Button onClick={submitHandler} className='m-4' type="button">Send Message</Button>
        </form>}
        {state.status==2 &&<div>Thanks for contacting us</div>}
      </div>
    </div>
  )
}
