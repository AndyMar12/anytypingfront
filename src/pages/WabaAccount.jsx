import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/axios";
import "../styles/layout.css";
import "../styles/tables.css";
import "../styles/forms.css";

function WabaAccount() {

    const [wabaAccount, setWabaAccount] = useState([]);

    const fetchWabaAccount = async () => {
        try {

            const res = await api.get("/wabatoken");
            setWabaAccount(res.data);
        } catch (err) {

            console.error(
                "Fetch waba accounts error:",
                err.response?.data || err.message
            );

        }
    };

    useEffect(() => {
        fetchWabaAccount();
    }, []);

    return (
        <div className="page-container">

            <div className="page-header">
                <h1 className="page-title">Tokens</h1>

                <Link to="/waba-accounts/create">
                    <button className="btn btn-primary">
                        Create Token
                    </button>
                </Link>
            </div>

            <div className="card">

                <table className="table">

                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Name</th>
                            <th>Phone Number ID</th>
                            <th>Waba ID</th>
                            <th>Verify Token</th>
                            <th>Access Token</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wabaAccount.map((token) => (
                            <tr key={token.id}>
                                <td>{token.company_id}</td>
                                <td>{token.name}</td>
                                <td>{token.phone_number_id}</td>
                                <td>{token.waba_id}</td>
                                <td>{token.verify_token}</td>
                                <td>{token.access_token}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default WabaAccount;