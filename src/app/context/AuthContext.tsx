import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
    isAuthenticated: boolean;
    isAdmin: boolean;
    roleLoading: boolean;
    user: User | null;
    login: (credentials: { email: string; password: string }) => Promise<{ error: { message: string } | null }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [roleLoading, setRoleLoading] = useState(true);

    const loadUserRole = async (userId: string | null) => {
        if (!userId) {
            setIsAdmin(false);
            setRoleLoading(false);
            return;
        }

        setRoleLoading(true);
        const { data } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", userId)
            .maybeSingle();

        setIsAdmin(data?.role === "admin");
        setRoleLoading(false);
    };

    useEffect(() => {
        const init = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            const initialUser = session?.user ?? null;
            setUser(initialUser);
            await loadUserRole(initialUser?.id ?? null);
            setLoading(false);

            const {
                data: { subscription },
            } = supabase.auth.onAuthStateChange((_event, sessionChange) => {
                const nextUser = sessionChange?.user ?? null;
                setUser(nextUser);
                void loadUserRole(nextUser?.id ?? null);
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
        setIsAdmin(false);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, roleLoading, user, login, logout }}>
            {!loading && !roleLoading && children}
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
