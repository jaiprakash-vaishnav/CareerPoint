import { useState, useEffect } from "react";
import User from "@/layout/client/index.jsx";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "./style.module.css";
function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const [userLoginMethod, setUserLoginMethod] = useState(false);
  useEffect(() => {
    if (authState.logedIn) {
      router.push("/dashboard");
    }
  });
  const handleRegister = () => {
    setUserLoginMethod(!userLoginMethod);
  }
  return (
    <User>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainerLeft}>
            <p className={styles.cardLeftHeading}> {userLoginMethod ? "Sign In" : "Sign Up"}</p>
            <div className={styles.inputContainer}>
              <div className={styles.inputRow}>
                <input type="text" className={styles.inputField} placeholder="Username"/>
                <input type="text" className={styles.inputField} placeholder="Name"/>
              </div>
              <input type="email" className={styles.inputField} placeholder="Email"/>
              <input type="password" className={styles.inputField} placeholder="Password"/>
              <div className={styles.buttonWithOutline}>
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
