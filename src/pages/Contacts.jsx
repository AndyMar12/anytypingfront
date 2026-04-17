import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import "../styles/layout.css";
import "../styles/tables.css";
import "../styles/forms.css";
import "../styles/contacts.css";

function Contacts() {
    const [contacts, setContacts] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await api.get("/contacts");
            setContacts(res.data.data);
        } catch (err) {
            console.error("Error loading contacts", err);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Contacts</h1>
            </div>
            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map(contact => (
                            <tr key={contact.id}>
                                <td className="contact-name">
                                    {contact.name
                                        ? contact.name
                                        : <span className="contact-empty">No name</span>}
                                </td>
                                <td className="contact-phone">
                                    {contact.phone_number}
                                </td>
                                <td>
                                    <div className="contacts-actions">
                                        <button className="btn btn-primary" onClick={() => navigate(`/contacts/${contact.id}`)}>
                                            View
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => navigate(`/conversations?contact=${contact.id}`)}
                                        >
                                            Chat
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Contacts;