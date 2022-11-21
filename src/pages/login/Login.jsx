import React, { useState } from "react";
import "./login.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnVisible, setBtnVisible] = useState(false);
  const [err, setErr] = useState("");
  const handleSubmit = async (e) => {
    if (email && password) {
      setIsLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setErr("Nom d'utilisateur ou mot de passe incorrect.Veillez réessayer");
      }
    }
  };
  return (
    <div className="register ">
      <div className="registerContainer">
        <div className="registerTop">
          <img
            className=""
            src="	https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
            alt=""
          />
          <br />

          <form
            className="registerForm loginForm"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Numero de telephone ou email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <div className="inputWrapper">
              <input
                type={isVisible ? "text" : "password"}
                placeholder="Mot de passe"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={() => setBtnVisible(true)}
              />
              {btnVisible && password && (
                <button
                  className="passwordBtn"
                  onClick={() => setIsVisible((t) => !t)}
                >
                  {isVisible ? "Masquer" : "Afficher"}
                </button>
              )}
            </div>
            <br />
            <button
              className="registerBtn"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? "Loading..." : "Se connecter"}
            </button>
          </form>
          <div className="otherLoginWay">
            <p className="trait"></p>
            <p>ou</p>
            <p className="trait"></p>
          </div>
          <button className="facebookLogin">
            <FacebookIcon />
            <span>Se connecter avec facebook</span>
          </button>
          {err && <p className="error">{err}</p>}
          <p>Mot de passe oublié ?</p>
        </div>
        <div className="registerBottom">
          Vous n'avez pas de compte ? <Link to="/register">inscrivez vous</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
