import {
  collection,
  onSnapshot,
  orderBy,
  query,
  
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { bdd } from "../../firebase-config";
import "./posts.css";

import Post from "../post/Post";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const postCollection = collection(bdd, "userPosts");
      const q = query(postCollection, orderBy("date", "desc"));
      onSnapshot(q, (snapShot) => {
        setPosts(snapShot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
    };
    fetchPosts();
  },[]);
  

  return (
    <div className="post">
      {posts.map((post) => {
        return <Post post={post} key={post.id} />;
      })}
    </div>
  );
};

export default Posts;
