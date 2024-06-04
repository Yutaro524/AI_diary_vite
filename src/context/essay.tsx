// src/context/essay.tsx
"use client"; // クライアントコンポーネントとしてマーク

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { db } from "../firebase";
import { Essay } from "../types/essay";
import { collection, query, getDocs, addDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { User } from "../types/user";

interface EssayContextType {
  essays: Essay[];
  addEssay: (title: string, content: string, changedContent: string) => Promise<void>;
}

const EssayContext = createContext<EssayContextType | undefined>(undefined);

export const useEssays = () => {
  const context = useContext(EssayContext);
  if (!context) {
    throw new Error("useEssays must be used within an EssayProvider");
  }
  return context;
};

export const EssayProvider = ({ children }: { children: ReactNode }) => {
  const [essays, setEssays] = useState<Essay[]>([]);
  const user = useAuth() as User | null;

  useEffect(() => {
    const fetchEssays = async () => {
      if (user) {
        const q = query(collection(db, "users", user.id, "essays"));
        const querySnapshot = await getDocs(q);
        const fetchedEssays: Essay[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        } as Essay));
        setEssays(fetchedEssays);
      } else {
        setEssays([]);
      }
    };

    fetchEssays();
  }, [user]);

  const addEssay = async (title: string, content: string, changedContent: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const newEssay = {
      title,
      content,
      changed_content: changedContent,
      userId: user.id,
      createdAt: new Date()
    };

    const docRef = await addDoc(collection(db, "users", user.id, "essays"), newEssay);
    setEssays((prevEssays) => [...prevEssays, { id: docRef.id, ...newEssay }]);
  };

  const value: EssayContextType = { essays, addEssay };

  return (
    <EssayContext.Provider value={value}>
      {children}
    </EssayContext.Provider>
  );
};
