import { useEffect, useState } from "react";
import api from "../services/axios";

function QuickReplies() {
    const [quickReplies, setQuickReplies] = useState([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        fetchQuickReplies();
    }, []);

    const fetchQuickReplies = async () => {
        try {
            const res = await api.get("/quickReplies");
            setQuickReplies(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setTitle("");
        setMessage("");
        setEditing(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editing) {
                const res = await api.put(`/quickReplies/${editing.id}`, {
                    title,
                    message
                });

                setQuickReplies(prev =>
                    prev.map(q => q.id === editing.id ? res.data : q)
                );
            } else {
                const res = await api.post("/quickReplies", {
                    title,
                    message
                });

                setQuickReplies(prev => [res.data, ...prev]);
            }

            resetForm();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (qr) => {
        setEditing(qr);
        setTitle(qr.title);
        setMessage(qr.message);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this quick reply?")) return;

        try {
            await api.delete(`/quickReplies/${id}`);
            setQuickReplies(prev => prev.filter(q => q.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Quick Replies</h2>

            {/* FORM */}
            <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <input
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ marginLeft: 10 }}
                    required
                />

                <button type="submit" style={{ marginLeft: 10 }}>
                    {editing ? "Update" : "Create"}
                </button>

                {editing && (
                    <button
                        type="button"
                        onClick={resetForm}
                        style={{ marginLeft: 5 }}
                    >
                        Cancel
                    </button>
                )}
            </form>

            {/* LIST */}
            <div>
                {quickReplies.map(qr => (
                    <div
                        key={qr.id}
                        style={{
                            border: "1px solid #ddd",
                            padding: 10,
                            borderRadius: 10,
                            marginBottom: 10
                        }}
                    >
                        <strong>{qr.title}</strong>
                        <p>{qr.message}</p>

                        <button onClick={() => handleEdit(qr)}>
                            Edit
                        </button>

                        <button
                            onClick={() => handleDelete(qr.id)}
                            style={{ marginLeft: 5 }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default QuickReplies;