import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { draftMode, headers } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post, PostComment } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import AddComment from './add.comment'
import { unstable_cache, revalidateTag } from 'next/cache'
import Comment from './comment'
import { getMeUser } from '@/utilities/getMeUser'

async function addComment(comment: any) {
  'use server'
  const payload = await getPayloadHMR({ config: configPromise })
  const newComment = await payload.create({
    collection: 'post-comments',
    data: comment,
  })
  revalidateTag(comment.postId)
}
async function updateComment(comment: any) {
  'use server'
  const payload = await getPayloadHMR({ config: configPromise })
  const newComment = await payload.update({
    collection: 'post-comments',
    data: comment,
    where: {
      id: { equals: comment.id },
    },
  })
  revalidateTag(comment.postId)
}
async function deleteComment(comment: any) {
  'use server'
  const payload = await getPayloadHMR({ config: configPromise })
  const newComment = await payload.delete({
    collection: 'post-comments',
    where: {
      id: { equals: comment.id },
    },
  })
  revalidateTag(comment.postId)
}

const loadComments = (postId: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayloadHMR({ config: configPromise })
      const comments = await payload.find({
        collection: 'post-comments',
        depth: 1,
        where: {
          postId: {
            equals: postId,
          },
        },
        limit: 1000,
      })
      return comments.docs ?? []
    },
    [postId],
    { tags: [postId] },
  )

function makeTree(comnts: PostComment[]) {
  const res: any[] = comnts
    .filter((it) => !it.replyId)
    .map((it: any) => {
      it.children = []
      return it
    })
  function dfs(arr: any[]) {
    for (let it of arr) {
      it.children = comnts.filter((a) => it.id === a.replyId)
      dfs(it.children)
    }
  }
  dfs(res)
  return res
}

export default async function Post({ params }: any) {
  //const url = '/posts/' + slug
  const { user } = await getMeUser()
  console.log(user)
  const { slug } = await params
  const post = await queryPostBySlug({ slug })()

  if (!post) return <div>Not Found</div>

  const comments = makeTree(await loadComments(post.id)())
  console.log(comments)

  return (
    // <article className="pt-16 pb-16">
    //   <PostHero post={post} />

    //   <div className="container lg:mx-0 lg:grid lg:grid-cols-[1fr_48rem_1fr] grid-rows-[1fr]">
    //     <RichText
    //       className="lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[1fr]"
    //       content={post.content}
    //       enableGutter={false}
    //     />
    //   </div>

    //    <div className="flex flex-col items-center w-[900px]">
    //     <div>{comments.length} Comments</div>
    //     <AddComment user={user} postId={post.id} addComment={addComment} />
    //     {comments.map((it) => (
    //       <Comment
    //         user={user}
    //         key={it.id}
    //         item={it}
    //         addComment={addComment}
    //         onUpdate={updateComment}
    //         onDelete={deleteComment}
    //       />
    //     ))}
    //   </div>

    // </article>
    <article className="pt-16 pb-16">
      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container lg:mx-0 lg:grid lg:grid-cols-[1fr_48rem_1fr] grid-rows-[1fr]">
          <RichText
            className="lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[1fr]"
            content={post.content}
            enableGutter={false}
          />
        </div>

        {/* {post.relatedPosts && post.relatedPosts.length > 0 && (
          <RelatedPosts
            className="mt-12"
            docs={post.relatedPosts.filter((post) => typeof post === 'object')}
          />
        )} */}

        <div className="flex flex-col items-stretch w-[750px]">
          <div className="font-bold">{comments.length} Comments</div>
          <AddComment user={user} postId={post.id} addComment={addComment} />
          {comments.map((it) => (
            <Comment
              user={user}
              key={it.id}
              item={it}
              addComment={addComment}
              onUpdate={updateComment}
              onDelete={deleteComment}
            />
          ))}
        </div>
      </div>
    </article>
  )
}

const queryPostBySlug = ({ slug }: { slug: string }) =>
  unstable_cache(
    async () => {
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
    },
    [slug],
    { tags: [`post-${slug}`] },
  )
