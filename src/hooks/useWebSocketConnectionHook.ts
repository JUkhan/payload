import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const PORT = process.env.SOCKET_PORT|| 4000;

const useWebSocketConnectionHook = (
  cb: (arg: unknown) => void,
  event: string
) => {
 
  const socketRef = useRef<Socket>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function socketClient() {
    const socket = io(`:${PORT}`, {
      path: "/api/socket",
      addTrailingSlash: false,
    });
    

    socket.on("connect", () => {
      socket.on(event, (data) => {
        cb(data);
      });
      console.log("Connected");

      socket.emit(event, "hi there");
      socket.emit(event, "hi there2");
      socket.emit(event, "hi there3");
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
