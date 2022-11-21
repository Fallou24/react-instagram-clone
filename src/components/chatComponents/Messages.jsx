import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { chatContext } from "../../context/ChatContext";
import { bdd } from "../../firebase-config";
import Message from "./Message";
import MessageInput from "./MessageInput";

const Messages = () => {
  const { state } = useContext(chatContext);
  const [messages, setMessages] = useState([]);
  const [isFetching,setIsFetching] = useState(false)
  useEffect(() => {
    const getMessages = () => {
      onSnapshot(doc(bdd, "chats", state.chatId), (doc) => {
        setMessages(doc.data().messages);
      });
    };
    state.chatId && getMessages();
  }, [state.chatId]);

  return (
    <div className="Messages">
      {state.chatId ? (
        <>
          <p className="messageTop">
            <img
              src={state.user.photoURL || "/images/noAvatar.png"}
              alt=""
              className="userProfilImg"
            />
            <span className="username">{state.user.username}</span>
          </p>
          <div className="messageContainer">
            {messages.map((message, index) => {
              return <Message message={message} key={index} />;
            })}
            {isFetching && <p className="isFetching">Envoi en cours ...</p>}
            
          </div>

          <MessageInput setIsFetching={setIsFetching} />
        </>
      ) : (
        <p className="chooseUserText">
          Choisir un utilisateur pour demarrer une conversation
        </p>
      )}
    </div>
  );
};

export default Messages;
