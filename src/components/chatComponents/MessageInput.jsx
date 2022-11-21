import React, { useContext, useState } from "react";
import { currentUser } from "../../context/AuthContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { bdd, storage } from "../../firebase-config";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { chatContext } from "../../context/ChatContext";

const MessageInput = ({setIsFetching}) => {
  const { userInfo } = useContext(currentUser);
  const { state } = useContext(chatContext);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  
  const handleSubmit = async (e) => {
    
    e.preventDefault();

    if (text) {
      if (file) {
        setIsFetching(true)
        const storageRef = ref(storage, file?.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {},
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await updateDoc(doc(bdd, "chats", state.chatId), {
                  messages: arrayUnion({
                    text,
                    imageURL: downloadURL,
                    uid: userInfo.uid,
                    date: Timestamp.now(),
                    photoURL: userInfo.photoURL,
                  }),
                });
                setIsFetching(false)
              }
            );
          }
        );
      } else {
        await updateDoc(doc(bdd, "chats", state.chatId), {
          messages: arrayUnion({
            text,
            uid: userInfo.uid,
            date: Timestamp.now(),
            photoURL: userInfo.photoURL,
          }),
        });
      }
      updateDoc(
        doc(bdd, "users/" + userInfo.uid + "/userChats", state.chatId),
        {
          lastMessage: text,
          date: serverTimestamp(),
        }
      );
      updateDoc(
        doc(bdd, "users/" + state.user.uid + "/userChats", state.chatId),
        {
          lastMessage: text,
          date: serverTimestamp(),
        }
      );
    }
    
    setText("");
    setFile(null);
    
  };
  return (
    <div className="messageForm" onSubmit={handleSubmit}>
      <form>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {text ? (
          <button type="submit" className="messageSubmitBtn">
            Envoyer
          </button>
        ) : (
          <label htmlFor="chooseFile">
            <svg
              aria-label="Ajouter une photo ou une vidéo"
              class="_ab6-"
              color="#262626"
              fill="#262626"
              height="24"
              role="img"
              viewBox="0 0 24 24"
              width="24"
            >
              <path
                d="M6.549 5.013A1.557 1.557 0 1 0 8.106 6.57a1.557 1.557 0 0 0-1.557-1.557Z"
                fill-rule="evenodd"
              ></path>
              <path
                d="m2 18.605 3.901-3.9a.908.908 0 0 1 1.284 0l2.807 2.806a.908.908 0 0 0 1.283 0l5.534-5.534a.908.908 0 0 1 1.283 0l3.905 3.905"
                fill="none"
                stroke="currentColor"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
              <path
                d="M18.44 2.004A3.56 3.56 0 0 1 22 5.564h0v12.873a3.56 3.56 0 0 1-3.56 3.56H5.568a3.56 3.56 0 0 1-3.56-3.56V5.563a3.56 3.56 0 0 1 3.56-3.56Z"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
          </label>
        )}
        <input
          type="file"
          id="chooseFile"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />
      </form>
    </div>
  );
};

export default MessageInput;
