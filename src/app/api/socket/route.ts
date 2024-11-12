
import type { NextApiRequest } from "next"
import { Server } from "socket.io"
import { NextResponse } from "next/server";


const PORT = process.env.SOCKET_PORT|| 4000;
export  function GET(_req: NextApiRequest) {
 
  //@ts-ignore
  if (global.io) {
    return NextResponse.json({ success: true, message: "Socket is already running", socket: `:${PORT}` })
  }

  console.log("Starting Socket.IO server on port:", PORT)
  //@ts-expect-error
  const io = new Server({ path: "/api/socket", addTrailingSlash: false, cors: { origin: "*" } })
  .listen(+PORT)

  io.on("connect", socket => {
    const _socket = socket
    console.log("socket connect", socket.id)
    _socket.broadcast.emit("welcome", `Welcome ${_socket.id}`)
    _socket.on('message', data=>{
      console.log(data);
      _socket.emit('message', data)
    })
    socket.on("disconnect", async () => {
      console.log("socket disconnect")
    })
  })
  //@ts-ignore
  global.io = io
  return NextResponse.json({ success: true, message: "Socket is started", socket: `:${PORT}` })
}