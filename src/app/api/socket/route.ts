
import type { NextApiRequest } from "next"
import { Server } from "socket.io"
import { NextResponse } from "next/server";
//import { getValidSession } from "@/lib/session";
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

const PORT = process.env.SOCKET_PORT|| 4000;
export  function GET(_req: NextApiRequest) {
 
  //@ts-ignore
  if (global.io) {
    return NextResponse.json({ success: true, message: "Socket is already running", socket: `:${PORT}` })
  }

  console.log("Starting Socket.IO server on port:", PORT)
  
  const io = new Server({ path: "/api/socket", addTrailingSlash: false, cors: { origin: "*" } })
  .listen(+PORT)
  /*io.use(async (socket, next)=>{
    console.log('session checking.....'+socket.id)
    const session=await getValidSession()
    if(session){
      console.log('valid')
      next()
    }else{
      console.log('invalid', session)
    }
  })*/
  
  io.on("connect", async s => {
    const socket = s
    const groups=await allGroups()
    console.log('_________',groups)
    socket.join(groups)
    console.log("socket connect", socket.id)
    //socket.broadcast.emit("welcome", `Welcome ${socket.id}`)
    
    socket.on('all', async data=>{console.log('all:', data)
      const message=await createMessage(data) as any
      message.groupName=data.groupName
      io.emit('group', message)
    })
    socket.on('group', async data=>{
      const message=await createMessage(data) as any
      message.groupName=data.groupName
      io.to(data.groupName).emit('group', message)
    })
    socket.on("join", async (data) => {
      console.log('joining ', data)
      socket.join(data.groupName)
      io.emit('join', data)
    })
    socket.on("disconnect", async () => {
      console.log("socket disconnect")
    })

  })
  //@ts-ignore
  global.io = io
  return NextResponse.json({ success: true, message: "Socket is started", socket: `:${PORT}` })
}

async function createMessage(data:any){
  const payload = await getPayloadHMR({ config: configPromise })
  const message = await payload.create({
    collection: 'chat-message',
    data
  })
  return message
}

async function allGroups() {
  const payload = await getPayloadHMR({ config: configPromise });

  const result = await payload.find({
    collection: "chat-group",
    limit: 1000,
    overrideAccess: true,
  });
  return (result.docs || []).filter(it=>it.groupName!=='All Users').map(it=>it.groupName)
}