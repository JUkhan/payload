import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const PORT = process.env.SOCKET_PORT|| 4000;

const useWebSocketConnectionHook = (
  cb: (listenningon:string, arg: unknown) => void
) => {
  
  const socketRef = useRef<Socket>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function socketClient() {
    const socket = io(`:${PORT}`, {
      path: "/api/socket",
      addTrailingSlash: false,
    });
    
    
    socket.on("connect", () => {
      socket.on('group', (data) => {
        cb('group', data);
      });
      socket.on('join', (data) => {
        cb('join', data);
      });
      console.log("Connected");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("connect_error", async (err) => {
      console.log(`connect_error due to ${err.message}`);
      await fetch('/api/socket');
    });
    //@ts-ignore
    socketRef.current = socket as Socket;
  }

  useEffect(() => {
    socketClient();
    return () => {
      socketRef?.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return socketRef
};

export default useWebSocketConnectionHook;
