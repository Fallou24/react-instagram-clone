import React, { useState } from "react";
import "./register.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, bdd } from "../../firebase-config";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    if (email && fullName && password && username) {
      const q = query(
        collection(bdd, "users"),
        where("username", "==", username)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setIsFetching(false);
        setErr("Veillez choisir un autre nom d'utilisateur")
        setUsername("");
      }
      if (querySnapshot.empty) {
        try {
          const res = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          await updateProfile(res.user, { displayName: username });
          await setDoc(doc(bdd, "users", res.user.uid), {
            uid: res.user.uid,
            username: res.user.displayName,
            fullName,
            email: res.user.email,
            followers: [],
            followings: [],
            photoURL: res.user.photoURL,
          });
        } catch (err) {
          console.log(err);
          setErr("Cette utilisateur existe deja");
          setIsFetching(false);
          setEmail("");
          setFullName("");
          setUsername("");
          setPassword("");
        }
      }
    }
  };
  return (
    <div className="register">
      <div className="registerContainer">
        <div className="registerTop">
          <img
            className=""
            src="	https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
            alt=""
          />
          <br />
          <h3 className="registerTitle">
            Inscrivez-vous pour voir les photos et vidéos de vos amis.
          </h3>
          <br />
          <button className="facebookBtn" disabled>
            <FacebookIcon />
            <span>Se connecter avec facebook</span>
          </button>
          <br />
          <div className="otherLoginWay">
            <p className="trait"></p>
            <p>ou</p>
            <p className="trait"></p>
          </div>
          <form className="registerForm" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <br />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nom complet"
              required
            />
            <br />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nom d'utilisateur"
              required
            />
            <br />
            <div className="inputWrapper">
              <input
                type={isVisible ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={() => setBtnVisible(true)}
              />
              {btnVisible && password && (
                <span
                  className="passwordBtn"
                  onClick={() => setIsVisible((t) => !t)}
                >
                  {isVisible ? "Masquer" : "Afficher"}
                </span>
              )}
            </div>
            <br />
            <button className="registerBtn" type="submit" disabled={isFetching}>
              {isFetching ? "loading..." : "S'inscrire"}
            </button>
          </form>
          {err && <p className="error"> {err}</p>}
        </div>
        <div className="registerBottom">
          Vous avez un compte ? <Link to="/">Connectez vous</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
