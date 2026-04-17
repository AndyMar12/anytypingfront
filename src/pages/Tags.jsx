import { useEffect, useState } from "react";
import api from "../services/axios";

function Tags() {
    const [tags, setTags] = useState([]);
    const [name, setName] = useState("");
    const [color, setColor] = useState("#3b82f6");
    const [editingTag, setEditingTag] = useState(null);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const res = await api.get("/tags");
            setTags(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setName("");
        setColor("#3b82f6");
        setEditingTag(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingTag) {
                const res = await api.put(`/tags/${editingTag.id}`, {
                    name,
                    color
                });

                setTags(prev =>
                    prev.map(t => t.id === editingTag.id ? res.data : t)
                );
            } else {
                const res = await api.post("/tags", { name, color });
                setTags(prev => [res.data, ...prev]);
            }

            resetForm();

        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (tag) => {
        setEditingTag(tag);
        setName(tag.name);
        setColor(tag.color || "#3b82f6");
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this tag?")) return;

        try {
            await api.delete(`/tags/${id}`);
            setTags(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Tags</h2>

            {/* FORM */}
            <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
                <input
                    placeholder="Tag name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{
                        marginLeft: 10,
                        width: "40px",
                        height: "40px",
                        padding: "0",
                        border: "none",
                        borderRadius: "8px", // O "50%" si lo quieres circular
                        cursor: "pointer",
                        verticalAlign: "middle",
                        background: "none"
                    }}
                />

                <button type="submit" style={{ marginLeft: 10 }}>
                    {editingTag ? "Update" : "Create"}
                </button>

                {editingTag && (
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
                {tags.map(tag => (
                    <div
                        key={tag.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 10
                        }}
                    >
                        <span
                            style={{
                                background: tag.color,
                                padding: "5px 10px",
                                borderRadius: 10,
                                color: "#fff",
                                marginRight: 10
                            }}
                        >
                            {tag.name}
                        </span>

                        <button onClick={() => handleEdit(tag)}>
                            Edit
                        </button>

                        <button
                            onClick={() => handleDelete(tag.id)}
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

export default Tags;