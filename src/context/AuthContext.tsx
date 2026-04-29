import {onAuthStateChanged, User} from "@firebase/auth";
import React, {createContext, useContext, useEffect, useState} from "react";
import {auth} from "../../firebase/config";

type AuthState = {
    user: User | null;
    isLoading: boolean;
};

const AuthContext = createContext<AuthState>({
    user: null,
    isLoading: true,
});


// Custon hook to save on importing
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: {children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=> {
        return onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setIsLoading(false);
        });
    },[]);

    return (
        <AuthContext.Provider value={{user,isLoading}}>
            {children}
        </AuthContext.Provider>
    )
}