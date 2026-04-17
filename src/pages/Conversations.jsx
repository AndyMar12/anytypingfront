import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getEcho } from "../services/echo";
import { useAuth } from "../auth/AuthContext";
import Select from "react-select";
import api from "../services/axios";
import SendMedia from "../components/SendMedia";
import "../styles/conversations.css";

function Conversations() {

    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const { user } = useAuth();
    const [contactProfile, setContactProfile] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [contactName, setContactName] = useState("");
    const inputRef = useRef(null);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [tags, setTags] = useState([]);
    const [conversationTags, setConversationTags] = useState([]);
    const [filteredQuickReplies, setFilteredQuickReplies] = useState([]);

    const [searchParams] = useSearchParams();
    const contactId = searchParams.get("contact");

    const messagesEndRef = useRef(null);
    const activeConversationRef = useRef(null);

    const [quickReplies, setQuickReplies] = useState([]);
    const [showQuickReplies, setShowQuickReplies] = useState(false);

    const prevConversationRef = useRef(null);

    useEffect(() => {
        activeConversationRef.current = activeConversation;
    }, [activeConversation]);

    useEffect(() => {
        if (contactId && conversations.length) {
            const conv = conversations.find(
                c => c.contact?.id == contactId
            );
            if (conv) {
                loadMessages(conv);
            }
        }
    }, [conversations]);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        fetchTags();
    }, []);

    useEffect(() => {
        if (editingName) {
            inputRef.current?.focus();
        }
    }, [editingName]);

    useLayoutEffect(() => {
        const isNewConversation =
            prevConversationRef.current !== activeConversation?.id;

        if (isNewConversation) {
            scrollToBottom(false);
        } else if (isNearBottom()) {
            scrollToBottom(true);
        }

        prevConversationRef.current = activeConversation?.id;
    }, [messages, activeConversation]);

    const chatRef = useRef(null);

    const isNearBottom = () => {
        const el = chatRef.current;
        if (!el) return true;

        return el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    };

    const fetchConversations = async () => {
        try {
            const res = await api.get("/conversations");
            setConversations(res.data.data);
        } catch (err) {
            console.error("Error loading conversations", err);
        }
    };

    const loadMessages = async (conversation) => {
        try {
            setShowProfile(false);
            setShowQuickReplies(false);
            setActiveConversation(conversation);
            const res = await api.get(`/messages?conversation_id=${conversation.id}`);
            setMessages(res.data);
            //console.log("Messages loaded:", res.data);
            //await api.patch(`/conversations/${conversation.id}`,{status: "close"});
        } catch (err) {
            console.error("Error loading messages", err);
        }
    };

    // WEBSOCKET COMPANY CHANNEL
    useEffect(() => {
        if (!user) return;
        const echo = getEcho();
        const channel = echo
            .private(`company.${user.company_id}`)
            .listen(".new-message", (e) => {

                const conversation = e.conversation;
                const message = e.message;

                //UPDATE CONVERSATION LIST
                // 1. Guarda de seguridad: Si no hay conversación, no hagas nada
                if (!conversation || !conversation.id) {
                    console.warn("Evento recibido sin conversación válida:", e);
                    return;
                }
                setConversations(prev => {
                    const filtered = prev.filter(c => c.id !== conversation.id);
                    const updatedConversation = {
                        ...conversation,
                        last_message: message // Inyectamos el mensaje directamente
                    };
                    return [updatedConversation, ...filtered];
                });

                //UPDATE MESSAGES IF OPEN
                if (activeConversationRef.current?.id === conversation.id) {
                    setMessages(prev => {
                        // Verificamos si el ID del mensaje ya está en el estado
                        const exists = prev.find(m => m.id === message.id);
                        if (exists) {
                            // 🔥 ACTUALIZA (este es el fix real)
                            return prev.map(m =>
                                m.id === message.id ? message : m
                            );
                        }
                        return [...prev, message]; // Si no existe, lo agregamos
                    });
                }
            });
        return () => {
            echo.leave(`company.${user.company_id}`);
            echo.leave();
        };
    }, [user]);

    const sendMessage = async () => {
        if (!newMessage || !activeConversation) return;
        try {
            await api.post("/messages/text", {
                conversation_id: activeConversation.id,
                message_body: newMessage,
                type: "text"
            });
            setNewMessage("");
        } catch (err) {
            console.error("Send message error", err);
        }
    };

    const openContactProfile = async (contactId) => {
        try {
            const res = await api.get(`/contacts/${contactId}`);
            setContactProfile(res.data);
            setContactName(res.data.name || "");
            setShowProfile(true);
            setEditingName(false);
        } catch (err) {
            console.error("Error loading contact profile", err);
        }
    };

    const updateContact = async () => {
        try {
            const res = await api.put(`/contacts/${contactProfile.id}`, {
                name: contactName
            });
            setContactProfile(res.data);
            setEditingName(false);

            // actualizar lista de conversaciones
            setConversations(prev =>
                prev.map(c =>
                    c.contact?.id === contactProfile.id
                        ? { ...c, contact: { ...c.contact, name: contactName } }
                        : c
                )
            );
        } catch (err) {
            console.error("Error updating contact", err);
        }
    };

    const renderMedia = (msg) => {
        switch (msg.type) {
            case "image":
            case "sticker":
                return (
                    <img
                        onLoad={scrollToBottom}
                        src={msg.file_url}
                        alt="media"
                        style={{ maxWidth: 200, cursor: "pointer", borderRadius: 10 }}
                        onClick={() => setSelectedMedia(msg)}
                    />
                );
            case "video":
                return (
                    <video
                        onLoad={scrollToBottom}
                        src={msg.file_url}
                        style={{ maxWidth: 250, cursor: "pointer" }}
                        onClick={() => setSelectedMedia(msg)}
                    />
                );
            case "audio":
                return <audio onLoad={scrollToBottom} src={msg.file_url} controls />;
            case "document":
                return (
                    <a href={msg.file_url} onLoad={scrollToBottom} target="_blank" rel="noopener noreferrer">
                        📄 Abrir documento
                    </a>
                );
            default:
                return null;
        }
    };
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth" ? "smooth" : "auto"
        });
    };

    const fetchTags = async () => {
        const res = await api.get("/tags");
        setTags(res.data);
    };

    const updateTags = async (selectedIds) => {
        const prev = conversationTags;
        // optimistic UI
        setConversationTags(tags.filter(t => selectedIds.includes(t.id)));
        try {
            const res = await api.post(`/conversations/${activeConversation.id}/tags`, {
                tags: selectedIds
            });
            setConversationTags(res.data.tags);
        } catch (err) {
            setConversationTags(prev); // rollback
            console.error(err);
        }
    };

    useEffect(() => {
        fetchQuickReplies();
    }, []);

    const fetchQuickReplies = async () => {
        try {
            const res = await api.get("/quickReplies");
            setQuickReplies(res.data);
        } catch (err) {
            console.error("Error loading quick replies", err);
            setQuickReplies([]);
        }
    };

    const handleInputChange = (value) => {
        setNewMessage(value);

        if (value.startsWith("/")) {
            const query = value.slice(1).toLowerCase();

            const filtered = quickReplies.filter(qr =>
                qr.shortcut.toLowerCase().includes(query)
            );

            setFilteredQuickReplies(filtered);
            setShowQuickReplies(true);
        } else {
            setShowQuickReplies(false);
        }
    };

    return (
        <div className={`conversations-container ${activeConversation ? "chat-open" : ""}`}>

            {/* LEFT PANEL */}
            <div className="conversation-list">
                <h3 style={{ padding: 10 }}>Conversations</h3>
                {conversations.map(conv => (
                    <div key={conv.id} onClick={() => loadMessages(conv)} className="conversation-item">
                        <div className="conversation-name">
                            {conv.contact?.name || conv.contact?.phone_number}
                        </div>
                        <div className="conversation-last-message">
                            {conv.last_message?.message_body || "No messages yet"}
                        </div>
                    </div>
                ))}
            </div>

            {/* RIGHT PANEL */}
            <div className={`chat-panel ${activeConversation ? "active" : ""}`}>
                {!activeConversation && (
                    <div>Select a conversation</div>
                )}
                {activeConversation && (
                    <>
                        <div className="chat-header">
                            <button
                                className="chat-back"
                                onClick={() => setActiveConversation(null)}
                            >
                                ←
                            </button>

                            <div className="chat-title">
                                {activeConversation.contact?.name || activeConversation.contact?.phone_number}
                            </div>
                        </div>

                        <div className="tags-container">
                            {conversationTags.map(tag => (
                                <span key={tag.id} style={{ background: tag.color }} className="tag">
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                        <div className="chat-messages" ref={chatRef}>
                            {messages.map(msg => (
                                <div key={msg.id} className={`message-row ${msg.direction}`}>
                                    <div className={`message-bubble ${msg.direction}`}>
                                        {msg.type !== "text" && renderMedia(msg)}
                                        {msg.message_body && (
                                            <div style={{ marginTop: msg.type !== "text" ? 5 : 0 }}>
                                                {msg.message_body}
                                            </div>
                                        )}
                                        {selectedMedia && (
                                            <div
                                                onClick={() => setSelectedMedia(null)}
                                                style={{
                                                    position: "fixed",
                                                    top: 0,
                                                    left: 0,
                                                    width: "100vw",
                                                    height: "100vh",
                                                    background: "rgba(0,0,0,0.9)",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    zIndex: 999
                                                }}
                                            >
                                                {selectedMedia.type === "image" || selectedMedia.type === "sticker" ? (
                                                    <img
                                                        onLoad={scrollToBottom}
                                                        src={selectedMedia.file_url}
                                                        alt="preview"
                                                        style={{ maxWidth: "90%", maxHeight: "90%" }}
                                                    />
                                                ) : selectedMedia.type === "video" ? (
                                                    <video
                                                        onLoad={scrollToBottom}
                                                        src={selectedMedia.file_url}
                                                        controls
                                                        autoPlay
                                                        style={{ maxWidth: "90%", maxHeight: "90%" }}
                                                    />
                                                ) : null}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="chat-input">
                            <input
                                value={newMessage}
                                onChange={(e) => handleInputChange(e.target.value)}
                            //onChange={(e) => setNewMessage(e.target.value)}
                            />
                            {/*<button onClick={() => setShowQuickReplies(!showQuickReplies)}>
                                ⚡
                            </button>*/}
                            {showQuickReplies && (
                                <div className="quick-replies-box">
                                    {filteredQuickReplies.map(qr => (
                                        <div
                                            key={qr.id}
                                            className="quick-reply-item"
                                            onClick={() => {
                                                setNewMessage(qr.message);
                                                setShowQuickReplies(false);
                                            }}
                                        >
                                            <strong>{qr.title}</strong>
                                            <div>{qr.message}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button onClick={sendMessage}>
                                Send
                            </button>
                            <SendMedia conversationId={activeConversation.id} />
                        </div>
                    </>
                )}
            </div>
            {showProfile && (
                <div className="profile-panel">
                    <button
                        onClick={() => setShowProfile(false)}
                        style={{ float: "right" }}
                    >
                        X
                    </button>
                    {contactProfile && (
                        <>
                            <h3>Contact Info</h3>
                            <div>
                                <strong>Name:</strong> {contactProfile.name}
                                {!editingName && (
                                    <>
                                        <button
                                            style={{ marginLeft: 10 }}
                                            onClick={() => setEditingName(true)}
                                        >
                                            Edit
                                        </button>
                                    </>
                                )}
                                {editingName && (
                                    <>
                                        <input
                                            ref={inputRef}
                                            value={contactName}
                                            onChange={(e) => setContactName(e.target.value)}
                                            style={{ marginLeft: 10 }}
                                        />
                                        <button
                                            onClick={updateContact}
                                            style={{ marginLeft: 10 }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingName(false);
                                                setContactName(contactProfile.name || "");
                                            }}
                                            style={{ marginLeft: 5 }}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                            <div>
                                <Select
                                    isMulti
                                    options={tags.map(tag => ({
                                        value: tag.id,
                                        label: tag.name
                                    }))}
                                    value={conversationTags.map(tag => ({
                                        value: tag.id,
                                        label: tag.name
                                    }))}
                                    onChange={(selected) => {
                                        const ids = selected ? selected.map(s => s.value) : [];
                                        updateTags(ids);
                                    }}
                                />
                                <strong>Phone:</strong> {contactProfile.phone_number}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default Conversations;