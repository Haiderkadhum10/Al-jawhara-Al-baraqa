import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (credentials: { email: string; password: string }) => Promise<{ error: { message: string } | null }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);

            const {
                data: { subscription },
            } = supabase.auth.onAuthStateChange((_event, sessionChange) => {
                setUser(sessionChange?.user ?? null);
            });

            return () => {
                subscription.unsubscribe();
            };
        };

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        init();
    }, []);

    const login = async (credentials: { email: string; password: string }) => {
        const { error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
        });

        if (error) {
            return {
                error: {
                    message: error.message || "فشل تسجيل الدخول. يرجى التحقق من بياناتك.",
                },
            };
        }

        return { error: null };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
