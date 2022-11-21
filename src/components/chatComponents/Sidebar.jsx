import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { currentUser } from "../../context/AuthContext";
import { chatContext } from "../../context/ChatContext";
import { bdd } from "../../firebase-config";
import SearchBar from "./SearchBar";

const Sidebar = () => {
  const { userInfo } = useContext(currentUser);
  const [users, setUsers] = useState([]);
  const {dispatch} = useContext(chatContext)

  useEffect(() => {
    const getUserChat = async () => {
      const q = query(collection(bdd, "users/" + userInfo?.uid + "/userChats"));
      onSnapshot(q, (snapShot) => {
        setUsers(snapShot.docs.map((doc) => ({ ...doc.data() })));
      });
    };
    getUserChat();
  }, [userInfo.uid]);
  const handleSelect = (user) =>{
    dispatch({type:"SELECT_USER",payload:user})
  }
  return (
    <div className="chatSidebar">
      <p className="sidebarTop">
        <img
          src={userInfo.photoURL || "/images/noAvatar.png"}
          alt=""
          className="userProfilImg"
        />
        <span className="username">{userInfo.username}</span>
      </p>
        <SearchBar />
      <div className="freinds">
        {users &&
          users.sort((a,b)=>b.date-a.date).map((user) => {
            return (
              <div className="chatUser" key={user.uid} onClick={()=>handleSelect(user)}>
                <img
                  src={user.photoURL || "/images/noAvatar.png"}
                  alt=""
                  className="userProfilImg"
                />
                <p className="freindInfo">
                  <span className="username">{user.username}</span>
                  {user.lastMessage && (
                    <span className="lastMessage">{user.lastMessage}</span>
                  )}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Sidebar;
