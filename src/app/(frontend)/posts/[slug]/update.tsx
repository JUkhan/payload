'use client'
import React, { useEffect, useRef } from 'react'
import {Textarea} from '@/components/ui/textarea'
import {Button} from '@/components/ui/button'
//import { useUser } from "@/providers/user-provider";

const UpdateComment = ({item, onUpdate, cb}:{item:any, onUpdate:any, cb:any}) => {
    //const {user}=useUser()
    const [comment, setComment]=React.useState(item.comment)
    const [hide, setHide]=React.useState(false)
    const txtRef=useRef<any>()
    useEffect(()=>{
        txtRef.current.focus()
    },[])
    const updateHandler=async ()=>{
        await onUpdate({...item, comment})
        setHide(true);setComment('')
        cb()
    }
  return (
    <div>
      <Textarea ref={txtRef} onClick={()=>setHide(false)} value={comment} onChange={ev=>setComment(ev.target.value)}></Textarea>
      {!hide &&<div className='flex float-end mt-2'>
        <Button  onClick={()=>{setHide(true);setComment('');cb()}} variant="link">Cancel</Button>
        <Button variant='link' disabled={comment.length===0} onClick={updateHandler}>Update</Button>
      </div>}
    </div>
  )
}

export default UpdateComment

