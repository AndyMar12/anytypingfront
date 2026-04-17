import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";

function CompanyCreate() {

  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    plan: "basic",
    max_agents: 5,
    email: "",
    max_messages_per_month: "",
    trial_ends_at: ""
  });

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

  };

  const createCompany = async () => {
    try {

      await api.post("/companies/create", form);
      alert("Company created");
      navigate("/companies");

    } catch (err) {

      console.error(
        "Create company error:",
        err.response?.data || err.message
      );

      alert("Error creating company");

    }
  };

  return (
    <div className="page-container">

      <h1 className="page-title">Create Company</h1>

      <div className="card">

        <div className="form-grid">
          <div className="form-group">
            <label>Company Name</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Plan</label>
            <select name="plan" value={form.plan} onChange={handleChange}>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div className="form-group">
            <label>Max Agents</label>
            <input type="number" name="max_agents" value={form.max_agents} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Max Messages Per Month</label>
            <input type="number" name="max_messages_per_month" value={form.max_messages_per_month} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Trial Ends</label>
            <input type="date" name="trial_ends_at" value={form.trial_ends_at} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} />
          </div>

        </div>

        <br />

        <button className="btn btn-primary" onClick={createCompany}>
          Create Company
        </button>

      </div>

    </div>
  );
}

export default CompanyCreate;