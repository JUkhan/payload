'use client'

import React from 'react'
import {Textarea} from '@/components/ui/textarea'
import {Button} from '@/components/ui/button'
import { useUser } from "@/providers/user-provider";

const AddComment = ({postId, addComment}:{postId:string, addComment:any}) => {
    const {user}=useUser()
    const [comment, setComment]=React.useState('')
    const [hide, setHide]=React.useState(true)
    const addHandler=async ()=>{
        await addComment({
            comment, postId, replyId:'', userName:`${user?.firstName} ${user?.lastName}`, userId:user?.id
        })
        setHide(true);setComment(_=>'')
    }
  return (
    <div>
      <Textarea onClick={()=>setHide(false)} placeholder='Add a comment...' value={comment} onChange={ev=>setComment(_=>ev.target.value)}></Textarea>
      {!hide &&<div className='flex float-end mt-2'>
        <Button  onClick={()=>{setHide(true);setComment(_=>'')}} variant="link">Cancel</Button>
        <Button variant='link' disabled={comment.length===0} onClick={addHandler}>Comment</Button>
      </div>}
    </div>
  )
}

export default AddComment

