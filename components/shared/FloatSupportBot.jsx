"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

// Avatar configuration
const AVATAR_IMG = "/images/customer-service.avif";
const WHATSAPP_LINK = "https://wa.me/916291531025";

const suggestedQuestions = [
  "Show me Home Decor",
  "What Wall Decor do you have?",
  "Tell me about Floor & Rooms",
  "What Services and Offers are available?",
];

export default function FloatSupportBot() {
  const [showQueryPill, setShowQueryPill] = useState(true);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [typing, setTyping] = useState(false);

  const endRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: 1,
          sender: "bot",
          text: "Hi 👋 Welcome to Avatrio.\n\nI can help you explore Home decor, Wall decor, Floors, Rooms, Services, and our latest Offers.\n\nHow can I help you today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const messageText = text ?? input;
    if (!messageText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setShowSuggestions(false);
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();

      window.setTimeout(() => {
        const botMsg = {
          id: Date.now() + 1,
          sender: "bot",
          text: data.reply,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMsg]);
        setTyping(false);
      }, 600);
    } catch {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "bot",
          text: "Something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <>
      <style>{`
        @keyframes steadyRipple {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        .animate-steady-ripple {
          animation: steadyRipple 1.5s linear infinite;
        }
      `}</style>
      {!open && (
        <div className="fixed right-4 md:right-4 bottom-4 md:bottom-4 z-[9999] flex items-center gap-4">
          {showQueryPill && (
            <div 
              className="relative bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 px-4 py-4 cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.16)] transition-shadow group"
              onClick={() => {
                setShowQueryPill(false);
                setOpen(true);
              }}
            >
              {/* Close Button permanent on mobile, hover on desktop */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQueryPill(false);
                }}
                className="absolute top-1.5 right-1.5 w-[22px] h-[22px] rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                aria-label="Close"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              {/* Right pointing tail */}
              <div className="absolute top-1/2 -right-[7px] -translate-y-1/2 w-[14px] h-[14px] bg-white border-r border-t border-gray-100 rotate-45 rounded-sm"></div>

              <div className="relative z-10 text-[13px] md:text-[14px] text-gray-800 text-center leading-[1.4] pr-2 md:pr-0">
                <div>Hey there.👋 Got any questions?</div>
                <div className="text-gray-500 hidden md:block mt-0.5">Schedule a personalized room design.</div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setShowQueryPill(false);
              setOpen(true);
            }}
            className="relative flex items-center justify-center focus:outline-none hover:scale-105 transition-transform duration-300"
          >
            {/* Soft pulse behind the avatar */}
            <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[#00c853] animate-steady-ripple"></span>
            
            {/* Avatar with solid green border */}
            <div className="relative z-10 rounded-full border-[2.5px] border-[#00c853] shadow-lg overflow-hidden flex items-center justify-center h-[56px] w-[56px] bg-[#FFD209]">
              <Image
                  loading="lazy"
                  src={AVATAR_IMG}
                  width={56}
                  height={56}
                  alt="store chat"
                  className="rounded-full object-cover"
              />
            </div>
          </button>
        </div>
      )}

      {open && (
        <div className="fixed right-3 bottom-7 z-[9999] flex h-[530px] w-[360px] max-w-[95vw] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/95 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="rounded-full overflow-hidden h-[40px] w-[40px] flex items-center justify-center shadow-sm bg-[#FFD209]">
                <Image
                  src={AVATAR_IMG}
                  width={40}
                  height={40}
                  alt="Avatar"
                  className="rounded-full"
                />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-black">Avatrio Support</p>
                <span className="text-[12px] text-gray-500">AI Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50/50 px-4 py-4">
            {messages.map((msg, index) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[90%] break-words whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.sender === "user" ? "bg-[#0084ff] text-white rounded-tr-sm" : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm"}`}>
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-base font-semibold text-gray-900 mt-2 mb-1">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-sm font-semibold text-gray-800 mt-2 mb-1">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-semibold text-gray-800 mt-1 mb-1">{children}</h3>,
                      strong: ({ children }) => <span className="font-semibold text-black">{children}</span>,
                      ul: ({ children }) => <ul className="mt-2 space-y-1 mb-2">{children}</ul>,
                      li: ({ children }) => (
                        <li className="relative pl-4">
                          <span className="absolute left-0 top-[8px] h-1 w-1 rounded-full bg-gray-400" />
                          {children}
                        </li>
                      ),
                      a: ({ href, children }) => {
                        const isWhatsapp = href?.includes("wa.me");
                        const isTel = href?.startsWith("tel:");
                        if (isWhatsapp || isTel) {
                          return (
                            <a href={href} target={isTel ? "_self" : "_blank"} rel="noreferrer" className={`block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold shadow-sm transition mt-3 ${isWhatsapp ? "bg-[#25D366] text-white hover:bg-[#20bd5a]" : "bg-black text-white hover:bg-gray-800"}`}>
                              {children}
                            </a>
                          );
                        }
                        return (
                          <a href={href} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                            {children}
                          </a>
                        );
                      }
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>

                  {index === 0 && showSuggestions && msg.sender === "bot" && (
                    <div className="mt-4 space-y-2">
                      {suggestedQuestions.map((q) => (
                         <button key={q} onClick={() => sendMessage(q)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-left text-xs transition hover:bg-gray-100 text-gray-700 font-medium">
                           {q}
                         </button>
                      ))}
                    </div>
                  )}
                  <div className={`mt-1.5 text-right text-[10px] ${msg.sender === "user" ? "text-gray-300" : "text-gray-400"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 rounded-2xl bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-tl-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 delay-150" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 delay-300" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="bg-white p-3 border-t border-gray-100">
            <div className="flex w-full items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-1 focus-within:border-gray-400 focus-within:bg-white transition-colors">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about decor, rooms, offers..."
                className="ml-3 h-[36px] w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
                onKeyDown={(e) => { if (e.key === "Enter") void sendMessage(); }}
              />
              <button 
                onClick={() => void sendMessage()} 
                disabled={!input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition disabled:opacity-50 disabled:bg-gray-300 mr-1"
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
