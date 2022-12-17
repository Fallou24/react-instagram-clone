import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { createRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bdd } from "../../firebase-config";
import "./researchResult.css";
import SearchIcon from "@mui/icons-material/Search";
import { useContext } from "react";
import { currentUser } from "../../context/AuthContext";

const ResearchResult = () => {
  const { userInfo } = useContext(currentUser);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [findResult, setFindResult] = useState(false);
  const ref = createRef();
  const inputRef = createRef();
  useEffect(() => {
    const getUser = async () => {
      const q = query(
        collection(bdd, "users"),
        where("username", "!=", userInfo.username)
      );
      onSnapshot(q, (snapshot) => {
        setUsers(snapshot.docs.map((doc) => ({ ...doc.data() })));
      });
    };
    getUser();
  }, [userInfo.username]);
  useEffect(() => {
    const handler = (e) => {
      if (
        !ref.current?.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setFindResult(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  return (
    <div className="searchForm">
      <div>
        <SearchIcon className="searchIcon" />
        <input
          type="text"
          placeholder="Rechercher"
          ref={inputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            setFindResult(true);
          }}
        />
      </div>
      {findResult && (
        <div className="searchResult" ref={ref}>
          {searchTerm &&
            users
              .filter((user) =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((res) => {
                const { photoURL, username, fullName, uid } = res;
                return (
                  <Link
                    to={"/profile/" + username}
                    className="searchResultItem"
                    key={uid}
                    onClick={() => {
                      setFindResult(false);
                      setSearchTerm("");
                    }}
                  >
                    <p>
                      <img
                        src={photoURL || "/images/noAvatar.png"}
                        alt=""
                        className="resultImg"
                      />
                    </p>
                    <p className="suggestionUserName">
                      <span className="username">{username}</span>
                      <span className="fullName">{fullName}</span>
                    </p>
                  </Link>
                );
              })}
        </div>
      )}
    </div>
  );
};

export default ResearchResult;
