const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

export function getLoginUrl() {
    return (
        `${COGNITO_DOMAIN}/login?` +
        `client_id=${CLIENT_ID}&` +
        `response_type=code&` +
        `scope=openid+email+profile&` +
        `redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
    );
}

export function getLogoutUrl() {
    return (
        `${COGNITO_DOMAIN}/logout?` +
        `client_id=${CLIENT_ID}&` +
        `logout_uri=${encodeURIComponent(window.location.origin)}`
    );
}

export async function exchangeCodeForTokens(code) {
    const response = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            code: code,
            redirect_uri: REDIRECT_URI,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to exchange code for tokens');
    }

    const data = await response.json();
    return {
        idToken: data.id_token,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
    };
}

export function parseJwt(token) {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
}

export function saveTokens(tokens) {
    sessionStorage.setItem('id_token', tokens.idToken);
    sessionStorage.setItem('access_token', tokens.accessToken);
    if (tokens.refreshToken) {
        sessionStorage.setItem('refresh_token', tokens.refreshToken);
    }
}

export function getIdToken() {
    return sessionStorage.getItem('id_token');
}

export function clearTokens() {
    sessionStorage.removeItem('id_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
}

export function isTokenExpired(token) {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
}