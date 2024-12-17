// SocketContext.js
import React, { createContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const socket = io("ws://localhost:3005", {
    reconnection: true,
    transports: ["websocket"],
  });
  const userId = user?._id;

  useEffect(() => {
    socket.emit("userOnline", { userId });
    socket.emit("joinGroup", { userId, groupId: userId });
    socket.emit("joinGroup", { userId, groupId: "friend_suggest_request" });
    socket.on("receiveNotification", (notification) => {
      console.log(notification);
    });
    return () => {
      socket.emit("userOffline", { userId });
      socket.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => React.useContext(SocketContext);
