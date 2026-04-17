import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";

function WabaAccountCreate() {

    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);

    const [form, setForm] = useState({
        name: "",
        phone_number_id: "",
        waba_id: "",
        access_token: "",
        verify_token: "",
        company_id: "",
    });

    useEffect(() => {
        const fetchCompanies = async () => {
            const res = await api.get("/companies");
            setCompanies(res.data);
        };

        fetchCompanies();
    }, []);

    const handleChange = (e) => {
        const { name, value, } = e.target;

        setForm({
            ...form,
            [name]: value
        });
    };

    const createToken = async () => {
        try {
            await api.post("/wabatoken", form);
            navigate("/waba-accounts");
        } catch (err) {
            console.error(
                "Create token error:",
                err.response?.data || err.message
            );
            alert("Error creating token");
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Create WABA</h1>

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
                        <label>Phone Number ID</label>
                        <input
                            name="phone_number_id"
                            type="number"
                            value={form.phone_number_id}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>WABA ID</label>
                        <input
                            name="waba_id"
                            value={form.waba_id}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Access Token</label>
                        <input
                            name="access_token"
                            value={form.access_token}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Verify Token</label>
                        <input
                            name="verify_token"
                            value={form.verify_token}
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
                </div>
                <br />
                <button
                    className="btn btn-primary"
                    onClick={createToken}
                >
                    Create WABA
                </button>
            </div>
        </div>
    );
}

export default WabaAccountCreate;