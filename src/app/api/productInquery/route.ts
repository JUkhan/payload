import { z } from 'zod'
import { NextResponse } from 'next/server'
import { simplifyZodMessage } from '@/utilities/simplifyZodMessage'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'


const queryTypeSchema= z.union([
    z.object({queryType:z.enum(['purchasing a product','obtaining a trial version']), message: z.string().min(30, 'Message must contain at least 30 character(s)')}), 
    z.object({queryType:z.string().refine(it=>it=='getting more information'), message: z.string().optional()})
])
const schema = z.object({
  name: z.string().min(1, { message: 'Your name must contain at least 2 character(s)' }),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  product: z.string().min(1, 'You must select a product'),
}).and(queryTypeSchema)


export async function POST(req: Request) {
  const formData = await req.formData()
  const obj = Object.fromEntries(formData)
  obj.queryType =obj['queryType[]'] as string
  const validation = schema.safeParse(obj)
  if (!validation.success) {
    return NextResponse.json({ status: 1, error: simplifyZodMessage(validation.error.issues) })
  }
  const payload = await getPayloadHMR({ config: configPromise })
  await payload.create({
    collection: 'product-inqueries',
    data: validation.data as any,
  })
 
  return NextResponse.json({ status: 2, error: {} })
}
