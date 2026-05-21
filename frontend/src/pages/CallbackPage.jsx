import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { exchangeCodeForTokens, saveTokens } from "../services/authService";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CallbackPage() {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();


    async function handleCallback() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        console.log('=== Callback: code found:', !!code);
        
        if (!code) {
            setError('Authorization code not found in URL.');
            return;
        }

        try {
            const tokens = await exchangeCodeForTokens(code);
            console.log('=== Callback: tokens received:', !!tokens.idToken);


            saveTokens(tokens);
            console.log('=== Callback: tokens saved');

            login(tokens);
            console.log('=== Callback: login called');

            navigate('/analyze');
        } catch (err) {
            console.log('=== Callback error:', err.message);
            setError("Login failed. Please try again.");
        }
    }

    useEffect(() => {
        setTimeout(() => {
            handleCallback();
        }, 0);
    }, []);

    if (error) {
        return (
            <div className="max-w-md mx-auto px-4 py-16 text-center">
                <p className="text-red-600">{error}</p>
                <a href="/" className="text-blue-600" hover:underline mt-4 inline-block>Return home</a>
            </div>
        );
    }

    return <LoadingSpinner message="Logging in..." />;
}