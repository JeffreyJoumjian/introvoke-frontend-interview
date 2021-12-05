import React, { useContext } from "react";

import { io } from "socket.io-client";

const socket = io("http://localhost:8080");
const SocketContext = React.createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	)
};