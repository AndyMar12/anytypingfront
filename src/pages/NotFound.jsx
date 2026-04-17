import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();
    return (
        <div style={{
            display: "flex",
            height: "80vh",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
        }}>
            <h1 style={{ fontSize: 60 }}>404</h1>
            <p>Page not found</p>
            <button
                onClick={() => navigate("/login")}
                style={{ marginTop: 20 }}
            >
                Go to dashboard
            </button>
        </div>
    );
}

export default NotFound;