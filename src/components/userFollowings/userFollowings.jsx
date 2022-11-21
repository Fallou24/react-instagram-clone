import React, { useEffect, useState } from "react";
import "./userFollowings.css";
import CloseIcon from "@mui/icons-material/Close";
import { bdd } from "../../firebase-config";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext } from "react";
import { currentUser } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const UserFollowings = ({ setCloseModal, username }) => {
  const [followingList, setFollowingList] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const { userInfo: current } = useContext(currentUser);
  useEffect(() => {
    const getUser = async () => {
      const userCollection = collection(bdd, "users");
      const q = query(userCollection, where("username", "==", username));
      const data = await getDocs(q);
      data.forEach((item) => {
        setUserInfo(item.data());
      });
    };
    getUser();
  }, [username]);
  useEffect(() => {
    const getFollowersInfo = async () => {
      if (userInfo?.followings) {
        const q = query(
          collection(bdd, "users"),
          where("uid", "in", userInfo.followings)
        );
        onSnapshot(q, (snapShot) => {
          setFollowingList(snapShot.docs.map((doc) => ({ ...doc.data() })));
        });
      }
    };
    getFollowersInfo();
  }, [userInfo?.followings]);
  const handleFollow = async (id) => {
    await updateDoc(doc(bdd, "users", current.uid), {
      followings: arrayUnion(id),
    });
    await updateDoc(doc(bdd, "users", id), {
      followers: arrayUnion(current.uid),
    });
  };
  const handleUnFollow = async (id) => {
    await updateDoc(doc(bdd, "users", userInfo.uid), {
      followings: arrayRemove(id),
    });
    await updateDoc(doc(bdd, "users", id), {
      followers: arrayRemove(userInfo.uid),
    });
  };
  

  return (
    <div className="createPost" onClick={() => setCloseModal(false)}>
      <div className="FollowerContainer" onClick={(e) => e.stopPropagation()}>
        <h3 className="createPostTitle">Suivi(e)s</h3>
        <>
          {followingList.map((following) => {
            const { photoURL, username, fullName } = following;
            return (
              <div className="userFollowersCon" key={following.uid}>
                <div className="followerLeft">
                  <Link to={"/profile/"+username} onClick={()=>setCloseModal(false)}>
                    <img
                      src={photoURL || "/images/noAvatar.png"}
                      className="followerImg"
                      alt=""
                    />
                  </Link>
                  <p className="followerName">
                    <span className="followerUsername">{username}</span>
                    <span>{fullName}</span>
                  </p>
                </div>
                {current.uid !== following.uid && (
                  <p>
                    {current.followings.includes(following.uid) ? (
                      <button className="unFollowBtn" onClick={()=>handleUnFollow(following.uid)}>Suivi(e)</button>
                    ) : (
                      <button className="profileFollowBtn" onClick={()=>handleFollow(following.uid)}>Suivre</button>
                    )}
                  </p>
                )}
              </div>
            );
          })}
        </>
      </div>

      <span className="closeIcon">
        <CloseIcon sx={{ fontSize: 30 }} />
      </span>
    </div>
  );
};

export default UserFollowings;
