//@ts-nocheck
'use client'
import React from 'react';
import {PostComment, User} from '@/payload-types'
import {Button} from '@/components/ui/button'
import AddReply from './reply'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
 

import Mutate from './mutate';

interface CommentProps {
  item: PostComment &{children:PostComment[]};
  addComment:any
  onUpdate:any,
  onDelete:any
  user:User
}

const Comment: React.FC<CommentProps> = ({ item, addComment, onUpdate, onDelete, user}) => {
    
    const [show, setShow]=React.useState(false)
  return (
    <div>
      <div className='mt-2'>
        {item.userName}
        <Mutate item={item} onUpdate={onUpdate} onDelete={onDelete} user={user}/>
      </div>
      
     
      <p>{item.comment}</p>
      <p>
        <Button variant='link' onClick={()=>setShow(_=>true)}>Reply</Button>
      </p>
      {show && <AddReply user={user} postId={item.postId } replyId={item.id} addComment={addComment} show={show} setShow={setShow}/>}
      {item.children.length>0 &&  <Accordion  type="single" collapsible className="w-full">
      <AccordionItem className='ml-4' value="item-1">
        <AccordionTrigger>{item.children.length} {item.children.length>1?'replies':'reply'}</AccordionTrigger>
        <AccordionContent>
          {item.children.map(it=><div className='ml-4' key={it.id}><Comment user={user}  item={it} addComment={addComment} onUpdate={onUpdate} onDelete={onDelete}/></div>)}
        </AccordionContent>
      </AccordionItem>
      
    </Accordion>}
    </div>
  );
};

export default Comment;

