import React from "react";
import Posts from "../../components/posts/Posts";
import Suggestions from "../../components/suggestions/Suggestions";
import Topbar from "../../components/topbar/Topbar";
import "./home.css"
const Home = () => {
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Posts/>
        <Suggestions />
      </div>
      
    </>
  );
};

export default Home;
