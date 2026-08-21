import { useEffect, useRef, useState } from "react";
import { api } from "../api/client.js";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Ask me about the menu, dietary options, or what to pair with your order." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setSending(true);

    try {
      const res = await api.chat(text);
      setMessages((m) => [...m, { role: "assistant", text: res.reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: `Couldn't reach the kitchen assistant: ${err.message}` },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <div className="shadow-ticket mb-3 flex h-96 w-80 flex-col rounded-lg border border-bottle-light bg-ink">
          <div className="flex items-center justify-between border-b border-bottle-light px-4 py-3">
            <span className="font-display text-sm text-bone">Kitchen assistant</span>
            <button
              onClick={() => setOpen(false)}
              className="text-bone/50 hover:text-bone"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-md px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-brass text-ink"
                    : "bg-bottle/60 text-bone"
                }`}
              >
                {m.text}
              </div>
            ))}
            {sending && (
              <div className="max-w-[85%] rounded-md bg-bottle/60 px-3 py-2 text-sm text-bone/60">
                Thinking…
              </div>
            )}
          </div>

          <form onSubmit={send} className="flex gap-2 border-t border-bottle-light p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something…"
              className="flex-1 rounded-md border border-bottle-light bg-bottle/30 px-3 py-2 text-sm text-bone placeholder:text-bone/40 focus:border-brass focus:outline-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="rounded-md bg-brass px-3 py-2 text-sm font-medium text-ink disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="shadow-ticket flex h-12 w-12 items-center justify-center rounded-full bg-brass text-ink hover:opacity-90"
        aria-label="Toggle chat"
      >
        {open ? "×" : "AI"}
      </button>
    </div>
  );
}