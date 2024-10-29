import { NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
type Menu = { title: string; content?: any; children?: Menu[]; expand?: boolean }
export async function POST(req: Request) {
  const data = await req.json()
  const query = data.searchTerm.toLowerCase()
  const payload = await getPayloadHMR({ config: configPromise })
  const manulas = await payload.find({
    collection: 'manuals',
    where: {
      or: [
        {
          and: [
            { 'items.content.root.children.type': { equals: 'block' } },
            { 'items.content.root.children.fields.content': { like: query } },
          ],
        },
        {
          and: [
            { 'items.subMenu.items.content.root.children.type': { equals: 'block' } },
            { 'items.subMenu.items.content.root.children.fields.content': { like: query } },
          ],
        },
        {
          and: [
            { 'items.subMenu.items.blockType': { equals: 'lavel2' } },
            { 'items.subMenu.items.items.content.root.children.type': { equals: 'block' } },
            { 'items.subMenu.items.items.content.root.children.fields.content': { like: query } },
          ],
        },
      ],
    },
    draft: false,
    limit: 1000,
    overrideAccess: false,
  })
  const menus:Menu[]=[]
 
  manulas?.docs.forEach((it) => {
    it.items
      .filter((a) => a.blockType == 'doc-title')
      .forEach((b) =>{
        if(b.content.root.children.find((a:any)=>a.type==='block' && a.fields.content && a.fields.content.toLowerCase().includes(query))){
           menus.push({title:b.title, content:b.content})
        }
    })

    it.items
      .filter((a: any)=>a.subMenu)
      .map((a:any)=>a.subMenu.items).flatMap(a=>a)
      .filter((a) => a.blockType == 'doc-title')
      .forEach((b) =>{
        if(b.content.root.children.find((a:any)=>a.type==='block' && a.fields.content && a.fields.content.toLowerCase().includes(query))){
           menus.push({title:b.title, content:b.content})
        }
    })

    it.items
      .filter((a: any)=>a.subMenu)
      .map((a:any)=>a.subMenu.items).flatMap(a=>a)
      .filter((a) => a.blockType == 'lavel2')
      .flatMap(a=>a.items)
      .forEach((b) =>{
        if(b.content.root.children.find((a:any)=>a.type==='block' && a.fields.content && a.fields.content.toLowerCase().includes(query))){
           menus.push({title:b.title, content:b.content})
        }
    })

  })
  return NextResponse.json(menus)
}
