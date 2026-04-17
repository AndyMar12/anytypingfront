import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import "../styles/layout.css";
import "../styles/tables.css";
import "../styles/forms.css";

function Companies() {

  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    const res = await api.get("/companies");
    setCompanies(res.data);
  };

  return (
    <div className="page-container">

      <div className="page-header">

        <h1 className="page-title">Companies</h1>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/companies/create")}
        >
          Create Company
        </button>

      </div>

      <div className="card">

        <table className="table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Plan</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {companies.map(company => (

              <tr
                key={company.id}
                onClick={() => navigate(`/companies/${company.id}`)}
              >

                <td>{company.id}</td>
                <td>{company.name}</td>
                <td>{company.slug}</td>
                <td>{company.plan}</td>
                <td>{company.status}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Companies;