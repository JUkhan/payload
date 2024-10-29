import { z } from 'zod'
import { NextResponse } from 'next/server'
import { simplifyZodMessage } from '@/utilities/simplifyZodMessage'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

const schema = z.object({
  name: z.string().min(1,{message:'Your name must contain at least 2 character(s)'}),
  email: z.string().email(),
  phone: z.string().min(11, 'Invalid phone number'),
  company: z.string().min(2,'Your company name must contain at least 2 character(s)'),
  message: z.string().min(30, 'Message must contain at least 30 character(s)'),
})

export async function POST(req: Request) {
  const formData = await req.formData()
  const validation=schema.safeParse(Object.fromEntries(formData))
  if(!validation.success){
    return NextResponse.json({ status: 1, error:simplifyZodMessage(validation.error.issues) })
  }
  const payload = await getPayloadHMR({ config: configPromise })
  await payload.create({
    collection: 'clients',
    data: validation.data as any,
  })
  return NextResponse.json({ status: 2, error:{} })
}
