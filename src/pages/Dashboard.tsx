import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useEssays } from '../context/essay';
import { logout } from "../lib/auth";
import { Link, useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const { essays } = useEssays();


  const base = import.meta.env.VITE_BASE_URL;

  if (!user) {
    navigate(`${base}`);
    return null; // ログインしていない場合は何も表示しない
  }

  return (
    <div>
      <h1>ユーザーごとのトップページ</h1>
      <p>こんにちは、{user.name}さん！</p>
      <button onClick={() => navigate(`${base}writing`)}>エッセイを書く</button>
      <button onClick={logout}>ログアウト</button>
      <h2>あなたのエッセイ一覧</h2>
      <ul>
        {essays.map((essay) => (
          <li key={essay.id}>
            <Link to={`${base}essay/${essay.id}`}>
              {essay.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
