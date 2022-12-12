import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import React, { useContext } from "react";
import { currentUser } from "../../context/AuthContext";
import { bdd } from "../../firebase-config";

const FollowUser = ({ post, isFollowed, setIsFollowed }) => {
  const { user } = useContext(currentUser);

  const handleFollow = async () => {
    setIsFollowed(true);
    await updateDoc(doc(bdd, "users", user.uid), {
      followings: arrayUnion(post.uid),
    });
    await updateDoc(doc(bdd, "users", post.uid), {
      followers: arrayUnion(user.uid),
    });
  };
  if (user.uid === post.uid || isFollowed) {
    return null;
  }

  return (
    <>
      <span className="dot"></span>
      <button className="followBtn" onClick={handleFollow}>
        Suivre
      </button>
    </>
  );
};
export default FollowUser;
