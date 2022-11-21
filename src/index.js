import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthContext from "./context/AuthContext";
import ChatContext from "./context/ChatContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContext>
    <ChatContext>
      <App />
    </ChatContext>
  </AuthContext>
);
