import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../../components/topbar/Topbar";
import { currentUser } from "../../context/AuthContext";
import { bdd } from "../../firebase-config";
import "./explore.css";

const Explore = () => {
  const { userInfo } = useContext(currentUser);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const getFollowersInfo = async () => {
      if (userInfo?.followings) {
        const q = query(
          collection(bdd, "users"),
          where("uid", "not-in", [...userInfo.followings, userInfo.uid])
        );
        onSnapshot(q, (snapShot) => {
          setUsers(snapShot.docs.map((doc) => ({ ...doc.data() })));
        });
      }
    };
    getFollowersInfo();
  }, []);
  const handleFollow = async (id) => {
    await updateDoc(doc(bdd, "users", userInfo.uid), {
      followings: arrayUnion(id),
    });
    await updateDoc(doc(bdd, "users", id), {
      followers: arrayUnion(userInfo.uid),
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
    <>
      <Topbar />
      <div className="explore">
        <h1 className="exploreTitle">Suggestions</h1>
        <div className="suggestionList">
          <div className="suggestionListWrapper">
            {users &&
              users.map((user) => {
                return (
                  <div key={user.uid} className="bottom">
                    <div className="bottomLeft">
                      <Link to={"/profile/" + user?.username}>
                        <img
                          src={user.photoURL || "/images/noAvatar.png"}
                          alt=""
                          className="suggestedImg"
                        />
                      </Link>
                      <p className="suggestionUserName">
                        <span className="username">{user?.username}</span>
                        <span className="fullName">{user?.fullName}</span>
                      </p>
                    </div>
                    <p className="bottomRight">
                      {userInfo.followings.includes(user.uid) ? (
                        <button
                          className="unFollowBtn"
                          onClick={() => handleUnFollow(user.uid)}
                        >
                          Suivi(e)
                        </button>
                      ) : (
                        <button onClick={() => handleFollow(user.uid)}>
                          Suivre
                        </button>
                      )}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Explore;
