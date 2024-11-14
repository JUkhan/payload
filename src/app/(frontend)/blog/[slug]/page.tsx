import type { Metadata } from 'next'


import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { draftMode, headers } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post, PostComment } from '@/payload-types'

import { PostHero } from '@/components/heros/PostHero'
import AddComment from './add.comment'
import {unstable_cache, revalidateTag } from 'next/cache'
import Comment from './comment'


 async function addComment(comment:any){
    'use server'
    const payload = await getPayloadHMR({ config: configPromise })
    const newComment = await payload.create({
      collection: 'post-comments',
      data: comment,
    })
    revalidateTag(comment.postId)
}
async function updateComment(comment:any){
  'use server'
  const payload = await getPayloadHMR({ config: configPromise })
  const newComment = await payload.update({
    collection:'post-comments',
    data:comment,
    where:{
      id:{equals:comment.id}
    }
  })
  revalidateTag(comment.postId)
}
async function deleteComment(comment:any){
  'use server'
  const payload = await getPayloadHMR({ config: configPromise })
  const newComment = await payload.delete({
    collection: 'post-comments',
    where:{
      id:{equals:comment.id}
    }
  })
  revalidateTag(comment.postId)
}

const loadComments= (postId:string)=>unstable_cache(async ()=>{
  
  const payload = await getPayloadHMR({ config: configPromise })
  const comments = await payload.find({
    collection: 'post-comments',
    depth:1,
    where: {
      postId: {
        equals: postId,
      },
    },
    limit:1000
  })
  return comments.docs??[]
},[postId],{tags:[postId]})

function makeTree(comnts:PostComment[]){
  const res:any[]=comnts.filter(it=>!it.replyId).map((it:any)=>{
    it.children=[]
    return it
  })
    function dfs(arr:any[]){
      for(let it of arr){
        it.children=comnts.filter(a=>it.id===a.replyId)
        dfs(it.children)
      }
    }
    dfs(res)
  return res
}

export default async function Post({ params }:any) {
  //const url = '/posts/' + slug
  const {slug}=await params
  const post = await queryPostBySlug({ slug })()

  if (!post) return <div>Not Found</div>

  const comments=makeTree(await loadComments(post.id)())
  
  return (
    <article className="pt-16 pb-16">
      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container lg:mx-0 lg:grid lg:grid-cols-[1fr_48rem_1fr] grid-rows-[1fr]">
          <RichText
            className=""
            content={post.content}
            enableGutter={false}
          />
        </div>
      </div>
      <div className='container mt-8'>
        <div>{comments.length} Comments</div>
        <AddComment  postId={post.id} addComment={addComment} />
        {comments.map(it=><Comment key={it.id} item={it} addComment={addComment} onUpdate={updateComment} onDelete={deleteComment}/>)}
      </div>
    </article>
  )
}



const queryPostBySlug =({ slug }: { slug: string })=> unstable_cache(async () => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: true,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
},[slug],{tags:[`post-${slug}`]})
