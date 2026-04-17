import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/axios";

function CompanyView() {

    const { id } = useParams();
    const [company, setCompany] = useState(null);

    useEffect(() => {
        const fetchCompany = async () => {
            const res = await api.get(`/superadmin/companies/${id}`);
            setCompany(res.data);
        };

        fetchCompany();
    }, [id]);

    if (!company) {
        return <p>Loading...</p>;
    }

    return (
        <div className="page-container">

<h1 className="page-title">Company Details</h1>

<div className="card">

<p><strong>Name:</strong> {company.name}</p>
<p><strong>Email:</strong> {company.email}</p>
<p><strong>Slug:</strong> {company.slug}</p>
<p><strong>Status:</strong> {company.status}</p>
<p><strong>Plan:</strong> {company.plan}</p>

<hr/>

<h3>Limits</h3>

<p><strong>Max Agents:</strong> {company.max_agents}</p>
<p><strong>Max Messages:</strong> {company.max_messages_per_month ?? "Unlimited"}</p>
<p><strong>Trial Ends:</strong> {company.trial_ends_at ?? "None"}</p>

<hr/>

<h3>Technical</h3>

<p><strong>Company ID:</strong> {company.id}</p>
<p><strong>API Key:</strong> **************</p>

</div>

</div>
    );
}

export default CompanyView;