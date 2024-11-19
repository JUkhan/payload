'use client'

import React from 'react'
import {Textarea} from '@/components/ui/textarea'
import {Button} from '@/components/ui/button'
import { User } from '@/payload-types'
//import { useUser } from "@/providers/user-provider";

const AddReply = ({postId, replyId, addComment, show, setShow, user}:{postId:string, replyId:string, addComment:any, show:boolean, setShow:any, user:User}) => {
  //const {user}=useUser()
    const [comment, setComment]=React.useState('')
    //const [hide, setHide]=React.useState(true)
    const addHandler=async ()=>{
        await addComment({
            comment, postId, replyId,  userName:`${user?.name}`, userId:user?.id
        })
        setShow(false);setComment(_=>'')
    }
  return (
    <div>
      <Textarea placeholder='Add a repply...' value={comment} onChange={ev=>setComment(_=>ev.target.value)}></Textarea>
      {show &&<div className='flex float-end mt-2'>
        <Button onClick={()=>{setShow(false);setComment(_=>'')}} variant="link">Cancel</Button>
        <Button variant='link' disabled={comment.length===0} onClick={addHandler}>Reply</Button>
      </div>}
    </div>
  )
}

export default AddReply

