import { useState, useRef, useEffect } from "react";
import { api } from "../api/client.js";

const suggestions = [
  "What's good for two people under $40?",
  "Anything vegetarian tonight?",
  "What pairs well with the house special?",
];

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
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  const send = async (text) => {
    if (!text || sending) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setSending(true);

    try {
      const res = await api.chat(text);
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    send(input.trim());
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-3xl flex-col px-6 py-12">
      <div className="mb-8">
        <p className="eyebrow">Kitchen assistant</p>
        <h1 className="mt-3 font-display text-4xl text-bone">Ask us anything</h1>
        <p className="mt-2 text-sm text-bone/55">
          Menu questions, allergies, recommendations, or the status of an order.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-bone/10 bg-ink-soft p-6 shadow-ticket">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "rounded-br-sm bg-brass text-ink"
                  : "rounded-bl-sm bg-bottle/50 text-bone"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-bottle/50 px-4 py-3">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="size-1.5 animate-bounce rounded-full bg-bone/60"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((text) => (
            <button
              key={text}
              onClick={() => send(text)}
              className="rounded-full border border-bone/15 px-4 py-2 text-xs text-bone/70 transition-colors hover:border-brass/60 hover:text-brass"
            >
              {text}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something…"
          className="flex-1 rounded-full border border-bone/15 bg-ink-soft px-5 py-3 text-sm text-bone placeholder:text-bone/35 transition-colors focus:border-brass focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="rounded-full bg-brass px-6 py-3 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          Send
        </button>
      </form>
    </div>
  );
}
