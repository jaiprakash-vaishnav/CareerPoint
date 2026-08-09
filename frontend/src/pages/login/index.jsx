import { useState, useEffect } from "react";
import User from "@/layout/client/index.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import { registerUser } from "@/config/redux/action/auth/index.js";

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
  });

  const handleRegister = () => {
    console.log("Registering user...");
    dispath(registerUser({username, name, email, password}));
  }
  return (
    <User>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainerLeft}>
            <p className={styles.cardLeftHeading}> {userLoginMethod ? "Sign In" : "Sign Up"}</p>
            {authState.message}
            <div className={styles.inputContainer}>
              <div className={styles.inputRow}>
                <input onChange={(e)=>{
                  setUsername(e.target.value);
                }} type="text" className={styles.inputField} placeholder="Username"/>
                <input onChange={(e)=>{
                  setName(e.target.value);
                }} type="text" className={styles.inputField} placeholder="Name"/>
              </div>
              <input onChange={(e)=>{
                setEmail(e.target.value);
              }} type="email" className={styles.inputField} placeholder="Email"/>
              <input onChange={(e)=>{
                setPassword(e.target.value);
              }} type="password" className={styles.inputField} placeholder="Password"/>
              <div onClick={()=>{
                if(userLoginMethod) {
                  // Handle Sign In
                } else {
                  handleRegister();
                }
              }} className={styles.buttonWithOutline}>
                <p> {userLoginMethod ? "Sign In" : "Sign Up"}</p>
              </div>
            </div>
          </div>
          <div className={styles.cardContainerRight}></div>
        </div>
      </div>
    </User>
  );
}

export default LoginComponent;
