import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from 'js-cookie'
// Context creation with type
const SocketContext = createContext(null);

// Custom hook (moved inside same file for HMR compatibility)
const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

// Provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = Cookies.get("token");

  useEffect(() => {
    const socketInstance = io(`${import.meta.env.VITE_APP_URL}`, {
      auth: { token },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected");
    });

    socketInstance.on("check-in-success", (data) => {
      console.log(data.message)
    })

    socketInstance.on("check-in-error", (data) => {
      console.log(data.message)
    })

    socketInstance.on("check-out-success", (data) => {
      console.log(data)
    })

    socketInstance.on("check-out-error", (data) => {
      console.log(data.message)
    })

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.close();
    };
  }, []);

  const value = {
    socket,
    isConnected,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

// Export hook for usage
export { useSocket };
