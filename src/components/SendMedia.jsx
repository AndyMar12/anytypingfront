import { useState, useEffect, useRef } from "react";
import api from "../services/axios";

function SendMedia({ conversationId }) {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [type, setType] = useState(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        setFile(selected);

        const mime = selected.type;

        if (mime.startsWith("image/")) {
            setType("image");
            setPreviewUrl(URL.createObjectURL(selected));
        } else if (mime.startsWith("video/")) {
            setType("video");
            setPreviewUrl(URL.createObjectURL(selected));
        } else if (mime.startsWith("audio/")) {
            setType("audio");
            setPreviewUrl(URL.createObjectURL(selected));
        } else {
            setType("document");
            setPreviewUrl(null);
        }
    };

    const handleSend = async () => {
        if (!file) return;
        if (loading) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("conversation_id", conversationId);

        try {
            setLoading(true);

            await api.post("/messages/media", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // limpiar
            setFile(null);
            setPreviewUrl(null);
            setType(null);

        } catch (err) {
            console.error("Error sending media", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFile(null);
        setPreviewUrl(null);
        setType(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <div style={{ padding: 10 }}>
            <button onClick={() => inputRef.current.click()}>
                📎
            </button>

            <input
                ref={inputRef}
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

            {/* PREVIEW */}
            {file && (
                <div style={{ marginTop: 10 }}>
                    <strong>{file.name}</strong>

                    <div style={{ marginTop: 10 }}>
                        {type === "image" && (
                            <img src={previewUrl} style={{ maxWidth: 200 }} />
                        )}

                        {type === "video" && (
                            <video src={previewUrl} controls style={{ maxWidth: 200, borderRadius: 10 }} />
                        )}

                        {type === "audio" && (
                            <audio src={previewUrl} controls />
                        )}

                        {type === "document" && (
                            <div>📄 Documento listo para enviar</div>
                        )}
                    </div>

                    <div style={{ marginTop: 10 }}>
                        <button onClick={handleSend} disabled={loading}>
                            {loading ? "Enviando..." : "Enviar"}
                        </button>

                        <button onClick={handleCancel} style={{ marginLeft: 10 }}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SendMedia;