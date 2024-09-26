"use client"; 

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthProviderProps {
    children: ReactNode; // กำหนดประเภทของ children เป็น ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    return <SessionProvider>{children}</SessionProvider>;
};
