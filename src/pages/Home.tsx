import { useAuth } from '../context/AuthContext';
import { login, logout } from "../lib/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const user = useAuth();
  const [waiting, setWaiting] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // ユーザーがログインしている場合はユーザーごとのトップページに遷移
      navigate(`/dashboard`);
    }
  }, [user, navigate]);

  const signIn = () => {
    setWaiting(true);

    login()
      .catch((error) => {
        console.error(error?.code);
      })
      .finally(() => {
        setWaiting(false);
      });
  };

  return (
    <div>
      {/* ユーザーがログインしていない場合はログインボタンを表示 */}
      {user === null && !waiting && <button onClick={signIn}>ログイン</button>}
      {/* ユーザーがログインしている場合はログアウトボタンを表示 */}
      {user && <button onClick={logout}>ログアウト</button>}
    </div>
  );
}
