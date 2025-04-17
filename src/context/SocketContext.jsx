import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";

// Context creation with type
const SocketContext = createContext(null);

// Custom hook
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
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  useEffect(() => {
    let socketInstance;

    if (user?.role === "employee") {
      socketInstance = io(`${import.meta.env.VITE_APP_URL}`, {
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
        console.log(data.message);
      });

      socketInstance.on("check-in-error", (data) => {
        console.log(data.message);
      });

      socketInstance.on("check-out-success", (data) => {
        console.log(data);
      });

      socketInstance.on("check-out-error", (data) => {
        console.log(data.message);
      });

      socketInstance.on("disconnect", () => {
        socketInstance.emit("check-out", {
          userId: user._id,
          date: new Date(),
        });
        setIsConnected(false);
        console.log("Socket disconnected");
      });
    }

    return () => {
      if (socketInstance) {
        socketInstance.off("connect");
        socketInstance.off("disconnect");
        socketInstance.close();
      }
    };
  }, []);

  // Corrected dependency array here:
  useEffect(() => {
    return () => {
      if (socket && user?._id) {
        socket.emit("check-out", {
          userId: user._id,
          date: new Date(),
        });
      } else {
        console.warn("Socket or user is not available on unmount");
      }
    };
  }, [socket, user]); // ✅ corrected dependencies

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
