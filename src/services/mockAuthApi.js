// A minimal, browser-safe JWT implementation using the Web Crypto API.
// In a REAL app, signing happens only on the server. This file simulates
// that server-side behavior entirely in the browser, for learning purposes only.

const MOCK_SECRET = "mock-secret-key-for-learning-only";

const MOCK_USERS = [
    { id: 1, username: "alice", password: "password123", role: "viewer" },
    { id: 2, username: "bob", password: "editorpass", role: "editor" },
    { id: 3, username: "admin", password: "adminpass", role: "admin" },
];

// --- Base64URL helpers (JWT uses base64url, not plain base64) ---

function base64UrlEncode(str) {
    return btoa(str)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

function base64UrlEncodeBytes(bytes) {
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return base64UrlEncode(binary);
}

// --- Signing (creating a token) ---

async function signToken(payload, secret) {
    const header = { alg: "HS256", typ: "JWT" };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;

    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" },
        false, ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(unsignedToken)
    );

    const signatureBytes = new Uint8Array(signatureBuffer);
    const encodedSignature = base64UrlEncodeBytes(signatureBytes);

    return `${unsignedToken}.${encodedSignature}`;
}

// --- Verifying (checking a token is authentic and not expired) ---

async function verifyTokenSignature(token, secret) {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;

    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" },
        false, ["sign"]
    );

    const expectedSignatureBuffer = await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(unsignedToken)
    );
    const expectedSignature = base64UrlEncodeBytes(
        new Uint8Array(expectedSignatureBuffer)
    );

    if (expectedSignature !== encodedSignature) {
        return null; // signature mismatch - token was tampered with or wrong secret
    }

    const payload = JSON.parse(atob(encodedPayload));

    if (payload.exp && Date.now() / 1000 > payload.exp) {
        return null; // token expired
    }

    return payload;
}

// --- Public API used by the rest of the app ---

export const loginRequest = (username, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(async() => {
            const user = MOCK_USERS.find(
                (u) => u.username === username && u.password === password
            );

            if (!user) {
                reject(new Error("Invalid username or password"));
                return;
            }

            const nowInSeconds = Math.floor(Date.now() / 1000);
            const payload = {
                sub: user.id,
                username: user.username,
                role: user.role,
                iat: nowInSeconds,
                exp: nowInSeconds + 60 * 60, // expires in 1 hour
            };

            const token = await signToken(payload, MOCK_SECRET);
            resolve({ token });
        }, 800);
    });
};

export const verifyToken = async(token) => {
    try {
        return await verifyTokenSignature(token, MOCK_SECRET);
    } catch (err) {
        return null;
    }
};