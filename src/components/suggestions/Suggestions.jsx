import React, { useContext } from "react";
import "./suggestions.css";
import { currentUser } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { bdd } from "../../firebase-config";

const Suggestions = () => {
  const { userInfo } = useContext(currentUser);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getFollowersInfo = async () => {
      if (userInfo?.followings) {
        const q = query(
          collection(bdd, "users"),
          where("uid", "not-in", [...userInfo.followings, userInfo.uid]),
          limit(5)
        );
        onSnapshot(q, (snapShot) => {
          setUsers(snapShot.docs.map((doc) => ({ ...doc.data() })));
        });
      }
    };
    getFollowersInfo();
  }, [userInfo?.uid]);

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
    <div className="suggestions">
      <div className="suggestionWrapper">
        <div className="suggestionTop">
          <Link to={"/profile/" + userInfo?.username}>
            <img
              src={userInfo?.photoURL || "/images/noAvatar.png"}
              className="currentUserImg"
              alt=""
            />
          </Link>
          <p className="suggestionUserName">
            <span className="username">{userInfo?.username}</span>
            <span className="fullName">{userInfo?.fullName}</span>
          </p>
        </div>
        <div className="suggestionTitle">
          <h3>Suggestions pour vous</h3>
          <Link to="/explore/people">Voir tout</Link>
        </div>
        <div>
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
                        style={{ color: "#000" }}
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
  );
};

export default Suggestions;
