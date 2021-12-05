import "./App.css";

import { SocketProvider } from "./Context/socket";

import Chat from "./Components/Chat";
import ChatInputs from "./Components/ChatInputs";

function App() {

  return (
    <div className="App flex flex-col">
      <SocketProvider>
        <Chat />
        <ChatInputs />
      </SocketProvider>
    </div>
  );
}

export default App;
