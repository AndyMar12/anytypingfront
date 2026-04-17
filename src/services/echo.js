import Echo from "laravel-echo";
import Pusher from "pusher-js";

let echo = null;

function getCsrfToken() {
    const name = "XSRF-TOKEN=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return null;
}

export function getEcho() {
    if (echo) {
        return echo;
    }
    if (!echo) {

        window.Pusher = Pusher;
        const token = sessionStorage.getItem('auth_token');
        echo = new Echo({
            broadcaster: "reverb",
            key: import.meta.env.VITE_REVERB_APP_KEY,
            //wsHost: import.meta.env.VITE_WS_URL,
            wssHost: import.meta.env.VITE_WS_URL,
            //wsPort: 443,
            wssPort: 443,
            forceTLS: true,
            encrypted: true,
            disableStats: true,
            enabledTransports: ["wss"],
            withCredentials: true,
            authEndpoint: import.meta.env.VITE_AUTHENDPOINT_URL,
            auth: {
                headers: {
                    "X-XSRF-TOKEN": getCsrfToken(), // Se ejecuta al llamar a getEcho()
                    "X-Requested-With": "XMLHttpRequest",
                    "Accept": "application/json",
                    "Authorization": token ? `Bearer ${token}` : undefined,
                }
            },
        });

        window.echo = echo; // opcional para debug
    }

    return echo;
}