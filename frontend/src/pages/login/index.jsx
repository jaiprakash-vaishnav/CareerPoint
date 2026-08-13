import { useState, useEffect } from "react";
import User from "@/layout/client/index.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import { registerUser, loginUser } from "@/config/redux/action/auth/index.js";
import { emptyMessage } from "@/config/redux/reducer/auth/index.js";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispath = useDispatch();
  const [userLoginMethod, setUserLoginMethod] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (authState.logedIn) {
      router.push("/dashboard");
    }
  }, [authState.logedIn]);

  const handleRegister = () => {
    console.log("Registering user...");
    dispath(registerUser({ username, name, email, password }));
  };

  useEffect(() => {
   dispath(emptyMessage());
  }, [userLoginMethod]);

  useEffect(() => {
    if(localStorage.getItem("token")){
      router.push("/dashboard");
    }
  });

  const handleLogin = () => {
    console.log("Logging in user...");
    dispath(loginUser({ email, password }));
  }

  return (
    <User>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainerLeft}>
            <p className={styles.cardLeftHeading}>
              {" "}
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </p>
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message.message}
            </p>
            <div className={styles.inputContainer}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                    type="text"
                    className={styles.inputField}
                    placeholder="Username"
                  />
                  <input
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    type="text"
                    className={styles.inputField}
                    placeholder="Name"
                  />
                </div>
              )}

              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                className={styles.inputField}
                placeholder="Email"
              />
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                className={styles.inputField}
                placeholder="Password"
              />
              <div
                onClick={() => {
                  if (userLoginMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
                className={styles.buttonWithOutline}
              >
                <p> {userLoginMethod ? "Sign In" : "Sign Up"}</p>
              </div>
            </div>
          </div>
          <div className={styles.cardContainerRight}>
            <div>
              <p>{userLoginMethod ? "Don't Have an Account ? " : "Already Have an Account ? "}</p>
              <div
                onClick={() => {
                  setUserLoginMethod(!userLoginMethod);
                }}
                style={{color : "black", display : "flex", justifyContent : "center", alignItems : "center", cursor : "pointer", marginTop : "1rem"}}
                className={styles.buttonWithOutline}
              >
                <p> {userLoginMethod ? "Sign Up" : "Sign In"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </User>
  );
}

export default LoginComponent;
