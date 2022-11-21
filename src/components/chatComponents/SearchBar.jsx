import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { useContext } from "react";
import { currentUser } from "../../context/AuthContext";
import { chatContext } from "../../context/ChatContext";
import { bdd } from "../../firebase-config";

const SearchBar = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { userInfo } = useContext(currentUser);
  const {dispatch} = useContext(chatContext)
  const handleSearch = async (e) => {
    if (e.code === "Enter" && searchTerm !== userInfo.username) {
      try {
        const q = query(
          collection(bdd, "users"),
          where("username", "==", searchTerm)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setSearchResult(doc.data());
        });
        setSearchTerm("");
      } catch (err) {
        console.log(err);
      }
    }
  };
  const handleSelect = async () => {
    const combinedId =
      userInfo.uid > searchResult.uid
        ? userInfo.uid + searchResult.uid
        : searchResult.uid + userInfo.uid;
    const msg = await getDoc(doc(bdd, "chats", combinedId));
    if (!msg.data()) {
      await setDoc(
        doc(bdd, "users/" + userInfo.uid + "/userChats", combinedId),
        {
          photoURL: searchResult.photoURL,
          username: searchResult.username,
          lastMessage: "",
          uid: searchResult.uid,
          date:""
        }
      );
      await setDoc(
        doc(bdd, "users/" + searchResult.uid + "/userChats", combinedId),
        {
          photoURL: userInfo.photoURL,
          username: userInfo.username,
          lastMessage: "",
          uid: userInfo.uid,
          date:""
        }
      );
      await setDoc(doc(bdd, "chats", combinedId), {
        messages: [],
      });
    }
    dispatch({type:"SELECT_USER",payload:searchResult})
    setSearchResult(null);
  };
  return (
    <div className="findUser">
      <input
        type="text"
        placeholder="Rechercher un utilisateur"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleSearch}
      />
      {searchResult && (
        <p className="chatUser" onClick={handleSelect}>
          <img
            src={searchResult.photoURL || "/images/noAvatar.png"}
            alt=""
            className="userProfilImg"
          />
          <span className="username">{searchResult.username}</span>
        </p>
      )
      }
    </div>
  );
};

export default SearchBar;
