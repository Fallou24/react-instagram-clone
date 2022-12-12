import React, { useContext, useEffect, useState } from "react";
import "./userFollowers.css";
import CloseIcon from "@mui/icons-material/Close";
import { bdd } from "../../firebase-config";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { currentUser } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { handleUnFollow } from "../../modules/unFollowUser";
import { handleFollow } from "../../modules/followUser";

const UserFollowers = ({ setCloseModal, username }) => {
  const [followerList, setFollowerList] = useState([]);
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
      if (userInfo?.followers) {
        const q = query(
          collection(bdd, "users"),
          where("uid", "in", userInfo.followers)
        );
        onSnapshot(q, (snapShot) => {
          setFollowerList(snapShot.docs.map((doc) => ({ ...doc.data() })));
        });
      }
    };
    getFollowersInfo();
  }, [userInfo.followers]);

  return (
    <div className="createPost" onClick={() => setCloseModal(false)}>
      <div className="FollowerContainer" onClick={(e) => e.stopPropagation()}>
        <h3 className="createPostTitle">Followers</h3>
        <>
          {followerList.map((follower) => {
            const { photoURL, username, fullName } = follower;
            return (
              <div className="userFollowersCon" key={follower.uid}>
                <div className="followerLeft">
                  <Link
                    to={"/profile/" + username}
                    onClick={() => setCloseModal(false)}
                  >
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
                {current.uid !== follower.uid && (
                  <p>
                    {current.followings.includes(follower.uid) ? (
                      <button
                        className="unFollowBtn"
                        onClick={() =>
                          handleUnFollow(current.uid, follower.uid)
                        }
                      >
                        Suivi(e)
                      </button>
                    ) : (
                      <button
                        className="profileFollowBtn"
                        onClick={() => handleFollow(current.uid, follower.uid)}
                      >
                        Suivre
                      </button>
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

export default UserFollowers;
