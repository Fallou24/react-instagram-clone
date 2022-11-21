import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { createRef, useContext, useEffect } from "react";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { currentUser } from "../../context/AuthContext";
import { bdd } from "../../firebase-config";
import "./postSettings.css";
import ModifyPost from "../modifyPost/ModifyPost";
const PostSettings = ({ post, setIsFollowed, isFollowed }) => {
  const ref = createRef();
  const { user } = useContext(currentUser);
  const [openModal, setOpenModal] = useState(false);
  const [modifyPost, setModifyPost] = useState(false);
  const [openModifyModal, setOpenModifyModal] = useState(false);
  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) {
        setModifyPost(false);
      }
    };
    document.body.addEventListener("click", handler, true);
    return () => {
      document.body.removeEventListener("click", handler, true);
    };
  });

  const handleUnFollow = async () => {
    setModifyPost(false);
    setIsFollowed(false);
    await updateDoc(doc(bdd, "users", post.uid), {
      followers: arrayRemove(user.uid),
    });
    await updateDoc(doc(bdd, "users", user.uid), {
      followings: arrayRemove(post.uid),
    });
  };
  if (!isFollowed && post.uid !== user.uid) {
    return null
  }
  
  return (
    <>
      <div className="postSetContainer">
      
        <MoreVertIcon onClick={() => setModifyPost(true)} />
        {modifyPost && (
          <>
            {post.uid === user.uid ? (
              <div className="postSetting" ref={ref}>
                <button
                  className="postSetBtn"
                  onClick={() => {
                    setModifyPost(false);
                    setOpenModal(true);
                  }}
                >
                  Supprimer
                </button>
                <button
                  className="postSetBtn"
                  onClick={() => setOpenModifyModal(true)}
                >
                  Modifier
                </button>
                <button
                  className="postSetBtn"
                  onClick={() => setModifyPost(false)}
                >
                  Annuler
                </button>
              </div>
            ) : isFollowed ? (
              <div className="postSetting" ref={ref}>
                <button className="postSetBtn" onClick={handleUnFollow}>
                  Ne plus suivre
                </button>
                <button
                  className="postSetBtn"
                  onClick={() => setModifyPost(false)}
                >
                  Annuler
                </button>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
      {openModal && <PostModal setOpenModal={setOpenModal} post={post} />}
      {openModifyModal && (
        <ModifyPost post={post} closeModal={setOpenModifyModal} />
      )}
    </>
  );
};

export default PostSettings;

const PostModal = ({ setOpenModal, post }) => {
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(bdd, "userPosts", post.id));
    } catch (err) {}
  };
  return (
    <div className="postModal">
      <div className="postModalContainer">
        <h3 className="postModalTitle">Supprimer la publication ?</h3>
        <p>Souhaitez vous vraiment supprimer cette publication ?</p>
        <button className="deleteBtn" onClick={handleDelete}>
          Supprimer
        </button>
        <button className="cancelBtn" onClick={() => setOpenModal(false)}>
          Annuler
        </button>
      </div>
    </div>
  );
};
