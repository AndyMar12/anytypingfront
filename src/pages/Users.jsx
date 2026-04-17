import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/axios";
import "../styles/layout.css";
import "../styles/tables.css";
import "../styles/forms.css";

function Users() {

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {

            const res = await api.get("/users");
            setUsers(res.data);
        } catch (err) {

            console.error(
                "Fetch users error:",
                err.response?.data || err.message
            );

        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="page-container">

            <div className="page-header">
                <h1 className="page-title">Users</h1>

                <Link to="/users/create">
                    <button className="btn btn-primary">
                        Create User
                    </button>
                </Link>
            </div>

            <div className="card">
                <table className="table">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Superadmin</th>
                            <th>Company</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.is_superadmin ? "YES" : "NO"}
                                </td>
                                <td>{user.company_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Users;