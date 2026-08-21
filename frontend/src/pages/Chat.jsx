import { useState, useRef, useEffect } from "react";
import { api } from "../api/client.js";
import "../styles/chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Ask me about the menu, dietary options, or what to pair with your order.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setSending(true);

    try {
      const res = await api.chat(text);
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry, I couldn't reach the kitchen assistant right now.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <p className="chat-eyebrow">Kitchen assistant</p>
        <h1 className="chat-title">Ask us anything</h1>
      </div>

      <div className="chat-window">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.role === "user" ? "chat-row-user" : "chat-row-assistant"}
          >
            <div
              className={
                msg.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"
              }
            >
              {msg.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="chat-row-assistant">
            <div className="chat-bubble-thinking">Thinking…</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="chat-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something…"
          className="chat-input"
        />
        <button type="submit" disabled={sending} className="chat-send-btn">
          Send
        </button>
      </form>
    </div>
  );
}