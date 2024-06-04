// src/pages/Writing.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEssays } from "../context/essay";
import { rewriteContent } from '../lib/azureOpenAI';

const base = import.meta.env.VITE_BASE_URL;

const Writing: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuth();
  const [title, setTitle] = useState<string>(''); 
  const [content, setContent] = useState<string>(''); 
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { addEssay } = useEssays();

  const saveEssay = async () => {
    if (!title || !content) {
      alert('タイトルと内容を入力してください');
      return;
    }

    if (!user) {
      alert('ログインしてください');
      return;
    }

    setIsSaving(true);

    try {
      const changedContent = await rewriteContent(content);      
      await addEssay(title, content, changedContent);
      console.log('エッセイが保存されました');
      navigate(`${base}dashboard`);
    } catch (e) {
      console.error('エッセイの保存中にエラーが発生しました: ', e);
      alert('エッセイの保存中にエラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1>エッセイを書く</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
        disabled={isSaving}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="ここにエッセイを書いてください"
        disabled={isSaving}
      ></textarea>
      <button onClick={saveEssay} disabled={isSaving}>
        保存する
      </button>
      <button onClick={() => navigate(`${base}dashboard`)} disabled={isSaving}>
        戻る
      </button>
    </div>
  );
};

export default Writing;
