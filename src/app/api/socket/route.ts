import type { NextApiRequest } from 'next'
import { Server } from 'socket.io'
import { NextResponse } from 'next/server'
//import { getValidSession } from "@/lib/session";
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { ChatUnreadStatus } from '@/payload-types'

const PORT = process.env.SOCKET_PORT || 4000
let activeUsers = new Map<string, string>()
let userList: any[] = []
export function GET() {
  //@ts-ignore
  if (global.io) {
    return NextResponse.json({
      success: true,
      message: 'Socket is already running',
      socket: `:${PORT}`,
    })
  }

  console.log('Starting Socket.IO server on port:', PORT)

  const io = new Server({
    path: '/api/socket',
    addTrailingSlash: false,
    cors: { origin: '*' },
  }).listen(+PORT)
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

  io.on('connect', async (s) => {
    const socket = s
    const groups = await allGroups()
    socket.join(groups)
    console.log('socket connect', socket.id)

    //socket.broadcast.emit("welcome", `Welcome ${socket.id}`)
    socket.on('activeUser', (currentUser, users) => {
      console.log(currentUser, '------')
      activeUsers.set(socket.id, currentUser.email)
      console.log('connected', socket.id, activeUsers.get(socket.id))
      userList = users
    })

    socket.on('all', async (data) => {
      const message = (await createMessage(data)) as any
      message.groupName = data.groupName
      io.emit('group', message)
      sendEmail(data)
    })
    socket.on('group', async (data) => {
      const message = (await createMessage(data)) as any
      message.groupName = data.groupName
      io.to(data.groupName).emit('group', message)
      sendEmail(data)
    })
    socket.on('join', async (data) => {
      socket.join(data.groupName)
      io.emit('join', data)
    })
    socket.on('disconnect', async () => {
      console.log('socket disconnect', socket.id)
      console.log(activeUsers)
      activeUsers.delete(socket.id)
      console.log(activeUsers)
    })
  })
  //@ts-ignore
  global.io = io
  return NextResponse.json({ success: true, message: 'Socket is started', socket: `:${PORT}` })
}

async function createMessage(data: any) {
  const payload = await getPayloadHMR({ config: configPromise })
  const message = await payload.create({
    collection: 'chat-message',
    data,
  })
  return message
}

function sendEmail(data: any) {
  console.log('Sending email')
  let offLineUsers: any[] = []
  const onlineUsers = new Map<string, string>()
  activeUsers.forEach((val) => onlineUsers.set(val, val))
  if (data.groupName === 'All Users') {
    offLineUsers = userList.filter((it) => !onlineUsers.has(it.email))
  } else {
    offLineUsers = data.groupUsers.filter((it) => !onlineUsers.has(it.userId))
  }
  console.log(offLineUsers)
  const all = offLineUsers.map((it) =>
    addUnreadStatus({ userId: it.userId || it.value, grrupName: data.groupName }),
  )
  Promise.all(all)
}

async function allGroups() {
  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'chat-group',
    limit: 1000,
    overrideAccess: true,
  })
  return (result.docs || []).filter((it) => it.groupName !== 'All Users').map((it) => it.groupName)
}

function addUnreadStatus(data: any) {
  return getPayloadHMR({ config: configPromise }).then((it) =>
    it.create({ collection: 'chat-unread-status', data }),
  )
}
