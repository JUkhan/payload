import fs from 'node:fs/promises'
import { NextResponse } from 'next/server'

//import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  await fs.writeFile(`./public/cvs/${file.name}`, buffer)

  return NextResponse.json({ status: true })
  //revalidatePath("/careers/");
}
