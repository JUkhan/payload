'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utilities/cn'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
type Response = { status: number; error: Record<string, string> }
export const ProductInquery: React.FC<{products:string[]}> = ({products}) => {
  const formRef = React.useRef<HTMLFormElement>(null)
  const [state, setState] = React.useState({ status: 0, error: {} } as Response)
  const [hideMessage, setHide]=React.useState(false)
  const submitHandler = React.useCallback(
    async () =>
      setState(
        await fetch('/api/productInquery', {
          method: 'POST',
          body: new FormData(formRef.current!),
        }).then((it) => it.json()),
      ),
    [],
  )

  return (
    <div>
      <div>Product Inquery</div>
      <div>Please submit the requested information to assist you with the software purchase.</div>
      {state.status == 1 && (
        <div>
          <ul>
            {Object.keys(state.error).map((it) => (
              <li className="text-yellow-400" key={it}>
                {state.error[it]}
              </li>
            ))}
          </ul>
        </div>
      )}
      {state.status in [0, 1] && (
        <form ref={formRef}>
          <div className="flex gap-4 p-4">
            <Input
              className={cn({ 'border-red-700': state.error['name'] })}
              type="text"
              name="name"
              placeholder="Your Name"
            />
          </div>
          <div className="flex gap-4 p-4">
            <Input
              className={cn({ 'border-red-700': state.error['email'] })}
              type="text"
              name="email"
              placeholder="Your Email"
            />
            <Input
              className={cn({ 'border-red-700': state.error['phone'] })}
              type="text"
              name="phone"
              placeholder="Phone Number"
            />
          </div>
          <div className="flex gap-4 p-4">
            <Input
              className={cn({ 'border-red-700': state.error['company'] })}
              type="text"
              name="company"
              placeholder="Company Name"
            />
            <Input
              className={cn({ 'border-red-700': state.error['jobTitle'] })}
              type="text"
              name="jobTitle"
              placeholder="Job Title"
            />
          </div>
          <div className="flex gap-4 p-4">
            <div>I am interested in</div>
            <RadioGroup name="queryType[]" defaultValue='purchasing a product' onValueChange={val=>{
              setHide(val==='getting more information')
            }}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="purchasing a product" id="r1" />
                <Label htmlFor="r1">purchasing a product.</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="obtaining a trial version" id="r2" />
                <Label htmlFor="r2">obtaining a trial version.</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="getting more information" id="r3" />
                <Label htmlFor="r3">getting more information.</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex gap-4 p-4">
            <Select name="product">
              <SelectTrigger>
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                {products.map(it=><SelectItem key={it} value={it}>{it}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {!hideMessage &&<div className="flex gap-4 p-4">
            <Textarea
              className={cn({ 'border-red-700': state.error['message'] })}
              rows={10}
              name="message"
              placeholder="Your Message"
            ></Textarea>
          </div>}
          <Button onClick={submitHandler} className="m-4" type="button">
            Submit
          </Button>
        </form>
      )}
      {state.status == 2 && <div>You successfully submitted your query.</div>}
    </div>
  )
}
