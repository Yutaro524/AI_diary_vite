// src/pages/Essay.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Essay } from '../types/essay';

const EssayContent: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const user = useAuth();
  const [essay, setEssay] = useState<Essay | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const base = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (!user) {
      navigate(`${base}login`);
      return;
    }

    const fetchEssay = async () => {
      try {
        const docRef = doc(db, `users/${user.id}/essays/${id}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEssay({ id: docSnap.id, ...docSnap.data() } as Essay);
        } else {
          navigate(`${base}404`);
        }
      } catch (error) {
        console.error('エッセイの取得中にエラーが発生しました: ', error);
        alert('エッセイの取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchEssay();
  }, [id, navigate, user]);

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (!essay) {
    return <p>エッセイが見つかりません。</p>;
  }

  return (
    <div>
      <h1>{essay.title}</h1>
      <h2>自分</h2>
      <p>{essay.content}</p>
      <h2>AI</h2>
      <p>{essay.changed_content}</p>
      <button onClick={() => navigate(`${base}dashboard`)}>戻る</button>
    </div>
  );
};

export default EssayContent;
