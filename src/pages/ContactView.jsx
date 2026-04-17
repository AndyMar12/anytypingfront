import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";

import "../styles/layout.css";
import "../styles/forms.css";
import "../styles/contacts.css";

function ContactView() {
    const { id } = useParams();
    const [contact, setContact] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchContact();
    }, [id]);

    const fetchContact = async () => {
        try {
            const res = await api.get(`/contacts/${id}`);
            setContact(res.data);
        } catch (err) {
            console.error("Error loading contact", err);
        }
    };

    if (!contact) {
        return (
            <div className="page-container">
                <div className="card">
                    <p>Loading contact...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Contact</h1>
            </div>
            <div className="card contact-view">
                <div className="contact-row">
                    <label>Name</label>
                    <div className="contact-value">
                        {contact.name || "No name"}
                    </div>
                </div>
                <div className="contact-row">
                    <label>Phone</label>
                    <div className="contact-value">
                        {contact.phone_number}
                    </div>
                </div>
                <div className="contact-row">
                    <label>Created</label>
                    <div className="contact-value">
                        {new Date(contact.created_at).toLocaleString()}
                    </div>
                </div>
                <div className="contact-actions">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/conversations?contact=${contact.id}`)}
                    >
                        Open Conversation
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ContactView;