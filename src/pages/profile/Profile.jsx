import React, { useContext, useEffect, useState } from "react";
import Topbar from "../../components/topbar/Topbar";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { bdd, storage } from "../../firebase-config";
import "./profile.css";
import { useParams } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { currentUser } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";
import UserFollowers from "../../components/userFollowers/UserFollowers";
import UserFollowings from "../../components/userFollowings/userFollowings";
import { handleUnFollow } from "../../modules/unFollowUser";
import { handleFollow } from "../../modules/followUser";

const Profile = () => {
  const { username } = useParams();
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [progress, setProgress] = useState(false);
  const [followerModal, setFollowerModal] = useState(false);
  const [followingModal, setFollowingModal] = useState(false);
  const {
    username: name,
    photoURL,
    fullName,
    followers,
    followings,
  } = userInfo;
  const { user, userInfo: current } = useContext(currentUser);

  useEffect(() => {
    const getUser = async () => {
      const userCollection = collection(bdd, "users");
      const q = query(userCollection, where("username", "==", username));
      const data = await getDocs(q);
      data.forEach((item) => {
        setUserInfo(item.data());
      });
    };
    const getPost = async () => {
      const postCollection = collection(bdd, "userPosts");
      const q = query(postCollection, where("username", "==", username));
      onSnapshot(q, (snapShot) => {
        setUserPosts(
          snapShot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      });
    };
    getUser();
    getPost();
  }, [username, current.followings, current.followers]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setProgress(true);
    const storageRef = ref(storage, "images/" + file?.name);
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
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await updateProfile(user, {
            photoURL: downloadURL,
          });
          await updateDoc(doc(bdd, "users", userInfo.uid), {
            photoURL: downloadURL,
          });
          userPosts.map(async (post) => {
            await updateDoc(doc(bdd, "userPosts", post.id), {
              photoURL: downloadURL,
            });
          });
          setProgress(false);
        });
      }
    );
  };

  return (
    <>
      <Topbar />
      {followerModal && (
        <UserFollowers username={username} setCloseModal={setFollowerModal} />
      )}
      {followingModal && (
        <UserFollowings username={username} setCloseModal={setFollowingModal} />
      )}
      <div className="profileContainer">
        {user.uid === userInfo.uid ? (
          <div className="profilImgContainer">
            <label htmlFor="profilePic" title="Ajouter une photo de profil">
              <img
                src={photoURL || "/images/noAvatar.png"}
                alt=""
                className="profileUserImg"
              />
              {progress && (
                <span className="progress">
                  <CircularProgress />
                </span>
              )}
            </label>
            <input
              type="file"
              id="profilePic"
              style={{ display: "none" }}
              onChange={handleUpload}
            />
          </div>
        ) : (
          <div className="profilImgContainer">
            <img
              src={photoURL || "/images/noAvatar.png"}
              alt=""
              className="profileUserImg"
              style={{ cursor: "auto" }}
            />
          </div>
        )}

        <p className="profileTop">
          <span className="profileUsername">{name}</span>
          {current.username !== username && (
            <>
              {current.followings.includes(userInfo.uid) ? (
                <button
                  className="profileFollowBtn"
                  onClick={() => handleUnFollow(current.uid, userInfo.uid)}
                >
                  Ne plus suivre
                </button>
              ) : (
                <button
                  className="profileFollowBtn"
                  onClick={() => handleFollow(current.uid, userInfo.uid)}
                >
                  Suivre
                </button>
              )}
            </>
          )}
        </p>
        <div className="profileBottom">
          <div className="userAct">
            <p>
              <span>{userPosts.length}</span> publication
            </p>
            {followers?.length === 0 ? (
              <p className="followers" style={{ cursor: "auto" }}>
                <span>0</span> Follower
              </p>
            ) : (
              <p className="followers" onClick={() => setFollowerModal(true)}>
                <span>{followers?.length}</span> follower(e)s
              </p>
            )}
            {followings?.length === 0 ? (
              <p className="followings" style={{ cursor: "auto" }}>
                <span>0</span> Suivi
              </p>
            ) : (
              <p className="followings" onClick={() => setFollowingModal(true)}>
                <span>{followings?.length}</span> Suivi(e)s
              </p>
            )}
          </div>
          <p className="profileFullname">{fullName}</p>
        </div>
      </div>

      <div className="postImages">
        {userPosts.map((post) => {
          return (
            <img
              src={post.imageURL}
              key={post.id}
              alt=""
              className="profilePostImg"
            />
          );
        })}
      </div>
    </>
  );
};

export default Profile;
