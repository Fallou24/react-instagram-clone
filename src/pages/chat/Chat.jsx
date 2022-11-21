import React from "react";
import Messages from "../../components/chatComponents/Messages";
import Sidebar from "../../components/chatComponents/Sidebar";
import Topbar from "../../components/topbar/Topbar";

import "./chat.css";

const Chat = () => {
 
  
  return (
    <>
      <Topbar />
      <div className="chat">
        <div className="chatContainer">
          <Sidebar />
          <Messages />
        </div>
      </div>
    </>
  );
};

export default Chat;
