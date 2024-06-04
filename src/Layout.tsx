// src/components/Layout.tsx
import React, { ReactNode } from 'react';
import { AuthProvider } from './context/AuthContext';
import { EssayProvider } from './context/essay';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <header>ヘッダー</header>
      <EssayProvider>
        <main>{children}</main>
      </EssayProvider>
      
      <footer>フッター</footer>
    </AuthProvider>
  );
};

export default Layout;
