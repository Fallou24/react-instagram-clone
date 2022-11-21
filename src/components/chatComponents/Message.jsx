import React, { createRef, useContext } from "react";
import { currentUser } from "../../context/AuthContext";
import {format} from "timeago.js"
import { useEffect } from "react";
const Message = ({ message }) => {
  const { userInfo } = useContext(currentUser);
  const ref = createRef()
  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:"smooth"})
  },[message])
  return (
    <div
      className={
        userInfo.uid === message.uid
          ? "currentUserMsg userMessage"
          : "userMessage"
      }
      ref={ref}
    >
      <p className="senderImgCont">
        <img
          src={message.photoURL || "/images/noAvatar.png"}
          alt=""
          className="senderImg"
        />
        <spna className="messageDate">just now</spna>
      </p>
      <p className="messageContent">
        <span className="text">{message.text}</span>
        {message.imageURL && (
          <img src={message.imageURL} alt="" className="imgContent" />
        )}
      </p>
    </div>
  );
};

export default Message;
