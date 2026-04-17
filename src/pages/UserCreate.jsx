import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";

function UserCreate() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        is_superadmin: false,
        company_id: "",
        role: ""
    });

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });

    };

    const createUser = async () => {

        try {

            await api.post("/users/create", form);

            navigate("/users");

        } catch (err) {

            console.error(
                "Create user error:",
                err.response?.data || err.message
            );

            alert("Error creating user");

        }

    };
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            const res = await api.get("/companies");
            setCompanies(res.data);
        };

        fetchCompanies();
    }, []);

    return (
        <div className="page-container">

            <h1 className="page-title">Create User</h1>

            <div className="card">

                <div className="form-grid">

                    <div className="form-group">
                        <label>Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Company</label>
                        <select
                            name="company_id"
                            value={form.company_id}
                            onChange={handleChange}
                        >
                            <option value="">Select company</option>

                            {companies.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}

                        </select>
                    </div>

                    <div className="form-group">
                        <label>Role</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="">Select role</option>
                            <option value="agent">Agent</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                </div>

                <br />

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="is_superadmin"
                            checked={form.is_superadmin}
                            onChange={handleChange}
                        />
                        &nbsp;Superadmin
                    </label>
                </div>

                <br />

                <button
                    className="btn btn-primary"
                    onClick={createUser}
                >
                    Create User
                </button>

            </div>

        </div>
    );
}

export default UserCreate;