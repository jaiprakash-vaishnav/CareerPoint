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
  return (
    <User>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainerLeft}>
            <p className={styles.cardLeftHeading}> {userLoginMethod ? "Sign In" : "Sign Up"}</p>
            <Buttton>Login</Buttton>
          </div>
          <div className={styles.cardContainerRight}></div>
        </div>
      </div>
    </User>
  );
}

export default LoginComponent;
