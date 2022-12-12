import React, { useContext, useEffect, useRef, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { currentUser } from "../../context/AuthContext";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  collection,
  addDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { bdd } from "../../firebase-config";
import Comments from "../comment/Comments";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import PostSettings from "../postSettings/PostSettings";
import FollowUser from "../followUser/FollowUser";

const Post = ({ post }) => {
  const { username, imageURL, likes, id, legend, date, photoURL } = post;

  const { userInfo } = useContext(currentUser);
  const [userLike, setUserLike] = useState(false);
  const [comments, setComments] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);
  const inputRef = useRef();
  useEffect(() => {
    setUserLike(likes.includes(userInfo.uid));
  }, [likes, userInfo.uid]);
  useEffect(() => {
    setIsFollowed(userInfo?.followings.includes(post.uid));
  }, [userInfo?.followings, post?.uid]);

  useEffect(() => {
    const getComments = async () => {
      const commentCollection = collection(
        bdd,
        "userPosts/" + id + "/userComments"
      );
      const q = query(commentCollection, orderBy("date", "desc"));
      onSnapshot(q, (snapShot) => {
        setComments(
          snapShot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      });
    };
    getComments();
  }, [id]);

  const handleLike = async () => {
    setUserLike(!userLike);
    const docRef = doc(bdd, "userPosts", id);
    await updateDoc(docRef, {
      likes: userLike ? arrayRemove(userInfo.uid) : arrayUnion(userInfo.uid),
    });
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const text = e.target[0].value;

    if (text) {
      const commentCollection = collection(
        bdd,
        "userPosts/" + id + "/userComments"
      );
      const commentDoc = {
        comment: text,
        username: userInfo.username,
        uid: userInfo.uid,
        photoURL: userInfo.photoURL,
        date: serverTimestamp(),
        likes: [],
      };
      await addDoc(commentCollection, commentDoc);
      
    }
    inputRef.current.value = "";
  };

  return (
    <article key={id} className="singlePost">
      <div className="postTop">
        <p className="postUserInfo">
          <Link to={"/profile/" + username} className="profileLink">
            {photoURL ? (
              <img src={photoURL} alt="" className="postUserImg" />
            ) : (
              <AccountCircleIcon style={{ color: "#ccc", fontSize: "35px" }} />
            )}
            <span className="username">{username}</span>
          </Link>
          <FollowUser
            post={post}
            isFollowed={isFollowed}
            setIsFollowed={setIsFollowed}
          />
        </p>
        <div className="postTopRight">
          <PostSettings
            post={post}
            setIsFollowed={setIsFollowed}
            isFollowed={isFollowed}
          />
        </div>
      </div>
      <div className="postImg">
        <img src={imageURL} alt="" className="postImgBg" />
      </div>
      <div className="postBottom">
        <div className="postIcons">
          <p className="postIconsLeft">
            <span onClick={handleLike}>
              {userLike ? (
                <svg
                  aria-label="Je n’aime plus"
                  class="_ab6-"
                  color="#ed4956"
                  fill="#ed4956"
                  height="24"
                  role="img"
                  viewBox="0 0 48 48"
                  width="24"
                >
                  <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                </svg>
              ) : (
                <svg
                  aria-label="J’aime"
                  class="_ab6-"
                  color="#000"
                  fill="#000"
                  height="24"
                  role="img"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                </svg>
              )}
            </span>

            <span onClick={() => inputRef.current.focus()}>
              <svg
                aria-label="Commenter"
                class="_ab6-"
                color="#000"
                fill="#000"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <path
                  d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
            </span>
          </p>
        </div>
        {likes.length > 0 && <p className="likes">{likes.length} J'aime</p>}

        <p>
          <span className="postUsername">{username}</span>
          <span className="legend">{legend}</span>
        </p>
        {comments.map((comment) => {
          return (
            <Comments userComment={comment} key={comment.id} postId={id} />
          );
        })}
        <p className="postDate">{format(new Date(date?.seconds * 1000))}</p>
      </div>
      <form className="commentForm" onSubmit={handleComment}>
        <span className="commentInput">
          <svg
            aria-label="Emoji"
            class="_ab6-"
            color="#262626"
            fill="#262626"
            height="24"
            role="img"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
          </svg>
          <input
            type="text"
            placeholder="Ajouter un commentaire"
            ref={inputRef}
          />
        </span>
        <button className="commentSubmitBtn">Publier</button>
      </form>
    </article>
  );
};

export default Post;
