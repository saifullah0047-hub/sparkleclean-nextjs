"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Chip = { label: string; emoji?: string };

type RecommendedService = {
  title: string;
  price: string;
  why: string[];
  bookingId: string;
  bookingPage: string;
  quotePage: string;
};

type Message = {
  id: string;
  role: "assistant" | "user";
  text?: string;
  chips?: Chip[];
  recommendation?: RecommendedService;
};

type ApiHistoryEntry = { role: "user" | "assistant"; content: string };

type ApiResponse = {
  success: boolean;
  message: string;
  recommendedService: string | null;
  serviceId: string | null;
  price: string | null;
  reason: string[];
  showBookButton: boolean;
  showQuoteButton: boolean;
};

/* ------------------------------------------------------------------ */
/*  Chip options                                                       */
/* ------------------------------------------------------------------ */

const INITIAL_CHIPS: Chip[] = [
  { emoji: "🏠", label: "Whole House" },
  { emoji: "🍳", label: "Kitchen" },
  { emoji: "🚿", label: "Bathroom" },
  { emoji: "🛋️", label: "Living Room" },
  { emoji: "🛏️", label: "Bedroom" },
  { emoji: "🧹", label: "Deep Cleaning" },
  { emoji: "✨", label: "Move-In / Move-Out" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

let msgId = 0;
function nextId() {
  return `m-${++msgId}`;
}

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  text: "Hi! 👋 What would you like help cleaning today?",
  chips: INITIAL_CHIPS,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AICleaningAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const conversationHistory = useRef<ApiHistoryEntry[]>([]);

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* Focus input on open */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  /* Keyboard: Escape closes */
  useEffect(() => {
    function handleKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape" && open) setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      setError(null);
      const userMsg: Message = { id: nextId(), role: "user", text: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setTyping(true);

      /* Add user message to conversation history */
      conversationHistory.current.push({
        role: "user",
        content: text.trim(),
      });

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 18000);

        const response = await fetch("/api/ai-assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text.trim(),
            history: conversationHistory.current.slice(-20),
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        const data: ApiResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to get AI response");
        }

        /* Build recommendation if service is provided */
        let recommendation: RecommendedService | undefined;
        if (data.recommendedService && data.serviceId) {
          recommendation = {
            title: data.recommendedService,
            price: data.price || "We'll provide your exact price after a few details.",
            why: data.reason.length > 0 ? data.reason : ["Recommended based on your needs"],
            bookingId: data.serviceId,
            bookingPage: "/book",
            quotePage: "/contact",
          };
        }

        const assistantMsg: Message = {
          id: nextId(),
          role: "assistant",
          text: data.message,
          recommendation,
          chips: INITIAL_CHIPS,
        };

        /* Add assistant message to conversation history */
        conversationHistory.current.push({
          role: "assistant",
          content: data.message,
        });

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: unknown) {
        /* Remove the user message from history on failure */
        conversationHistory.current.pop();

        let errorMessage = "Something went wrong. Please try again.";
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            errorMessage = "Request timed out. Please try again.";
          } else if (err.message) {
            errorMessage = err.message;
          }
        }
        setError(errorMessage);

        const errorMsg: Message = {
          id: nextId(),
          role: "assistant",
          text: `Sorry, I couldn't process that. ${errorMessage}`,
          chips: INITIAL_CHIPS,
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setTyping(false);
      }
    },
    []
  );

  const handleChipClick = useCallback(
    (chip: Chip) => {
      sendMessage(chip.label);
    },
    [sendMessage]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input);
      }
    },
    [input, sendMessage]
  );

  return (
    <>
      {/* ---- Floating Trigger Button ---- */}
      <button
        className="ai-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={open}
        aria-controls="ai-assistant-panel"
      >
        <span className={`ai-fab-icon ${open ? "ai-fab-icon--open" : ""}`}>
          {open ? (
            <i className="fa-solid fa-xmark" />
          ) : (
            <i className="fa-solid fa-wand-magic-sparkles" />
          )}
        </span>
        {!open && <span className="ai-fab-label">Ask CleanAI</span>}
      </button>

      {/* ---- Chat Panel ---- */}
      <div
        id="ai-assistant-panel"
        ref={panelRef}
        className={`ai-panel ${open ? "ai-panel--open" : ""}`}
        role="dialog"
        aria-label="AI Cleaning Assistant"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="ai-panel-header">
          <div className="ai-panel-header-left">
            <span className="ai-avatar" aria-hidden="true">
              <i className="fa-solid fa-sparkles" />
            </span>
            <div>
              <div className="ai-panel-title">CleanAI Assistant</div>
              <div className="ai-panel-subtitle">Powered by AI</div>
            </div>
          </div>
          <button
            className="ai-close-btn"
            onClick={() => setOpen(false)}
            aria-label="Close assistant"
          >
            <i className="fa-solid fa-chevron-down" />
          </button>
        </div>

        {/* Messages */}
        <div className="ai-messages" role="log" aria-live="polite">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`ai-bubble-row ai-bubble-row--${msg.role}`}
            >
              {msg.role === "assistant" && (
                <span className="ai-bubble-avatar" aria-hidden="true">
                  <i className="fa-solid fa-sparkles" />
                </span>
              )}
              <div className="ai-bubble-content">
                {msg.text && (
                  <div className="ai-bubble">{formatText(msg.text)}</div>
                )}

                {msg.recommendation && (
                  <div className="ai-recommendation">
                    <div className="ai-rec-header">
                      <span className="ai-rec-label">Recommended Service</span>
                      <strong className="ai-rec-title">
                        {msg.recommendation.title}
                      </strong>
                    </div>
                    {msg.recommendation.price && (
                      <div className="ai-rec-price">
                        {msg.recommendation.price}
                      </div>
                    )}
                    <div className="ai-rec-why">
                      <span className="ai-rec-why-label">Why</span>
                      <ul className="ai-rec-why-list">
                        {msg.recommendation.why.map((item) => (
                          <li key={item}>
                            <i className="fa-solid fa-circle-check" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="ai-rec-actions">
                      <a
                        href={msg.recommendation.quotePage}
                        className="ai-btn ai-btn--outline"
                      >
                        <i className="fa-solid fa-envelope" /> Get a Quote
                      </a>
                      <a
                        href={msg.recommendation.bookingPage}
                        className="ai-btn ai-btn--primary"
                      >
                        <i className="fa-solid fa-calendar-check" /> Book Now
                      </a>
                    </div>
                  </div>
                )}

                {msg.chips && (
                  <div className="ai-chips" role="group" aria-label="Quick options">
                    {msg.chips.map((chip) => (
                      <button
                        key={chip.label}
                        className="ai-chip"
                        onClick={() => handleChipClick(chip)}
                      >
                        {chip.emoji && (
                          <span className="ai-chip-emoji">{chip.emoji}</span>
                        )}
                        {chip.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="ai-bubble-row ai-bubble-row--assistant">
              <span className="ai-bubble-avatar" aria-hidden="true">
                <i className="fa-solid fa-sparkles" />
              </span>
              <div className="ai-typing" aria-label="Assistant is typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Error banner */}
        {error && (
          <div className="ai-error-banner" role="alert">
            <i className="fa-solid fa-triangle-exclamation" />
            <span>{error}</span>
            <button onClick={() => setError(null)} aria-label="Dismiss error">
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        )}

        {/* Input */}
        <form
          className="ai-input-bar"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
        >
          <input
            ref={inputRef}
            className="ai-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you need cleaned..."
            aria-label="Type your cleaning question"
            autoComplete="off"
          />
          <button
            type="submit"
            className="ai-send-btn"
            disabled={!input.trim() || typing}
            aria-label="Send message"
          >
            <i className="fa-solid fa-paper-plane" />
          </button>
        </form>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="ai-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatText(text: string) {
  /* Simple markdown-like bold: **text** */
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
