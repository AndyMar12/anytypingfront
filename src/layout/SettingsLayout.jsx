import { Link, Outlet } from "react-router-dom";

function SettingsLayout() {
    return (
        <div style={{ display: "flex", height: "100%" }}>

            {/* SIDEBAR */}
            <div style={{
                width: 220,
                borderRight: "1px solid #ddd",
                padding: 15
            }}>
                <h3>Settings</h3>

                <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Link to="/settings/tags">Tags</Link>
                    <Link to="/settings/quick-replies">Quick Replies</Link>
                    {/* <Link to="/settings/templates">Templates</Link> */}
                    {/* <Link to="/settings/waba">WABA</Link> */}
                </nav>
            </div>

            {/* CONTENT */}
            <div style={{ flex: 1, padding: 20 }}>
                <Outlet />
            </div>

        </div>
    );
}

export default SettingsLayout;