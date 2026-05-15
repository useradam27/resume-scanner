import { createContext, useState, useEffect } from "react";
import { getIdToken, clearTokens, parseJwt, isTokenExpired, getLogoutUrl } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    function checkAuth() {
        const token = getIdToken();
        if (token && !isTokenExpired(token)) {
            const userInfo = parseJwt(token);
            setUser({
                username: userInfo['cognito:username'],
                email: userInfo.email,
            });
        } else {
            clearTokens();
            setUser(null);
        }
        setLoading(false);
    }

    function login() {
        const payload = parseJwt(tokens.idToken);
        setUser({
            email: payload.email,
            sub: payload.sub,
        });
    }

    function logout() {
        clearTokens();
        setUser(null);
        window.location.href = getLogoutUrl(); // Redirect to Cognito logout
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}