import { useEffect } from 'react';
import { useRouter } from 'next/router';
export default function dashboard() {
    const router = useRouter();
    useEffect(() => {
        if(!localStorage.getItem("token")){
          router.push("/login");
        }
    });
  return (
    <div>dashboard</div>
  )
}
