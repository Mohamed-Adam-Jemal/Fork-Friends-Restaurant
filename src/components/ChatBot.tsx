'use client';

import { useState, useRef, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { AiFillMessage } from "react-icons/ai";
import { AnimatePresence, motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaArrowUp } from "react-icons/fa";

type Message = {
  type: "user" | "ai";
  text: string;
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false); // <-- new error state
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) {
      setError(true); // mark input as invalid
      return;
    }

    setError(false); // clear error
    const userMessage: Message = { type: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        type: "ai",
        text: data.reply ?? "Sorry, I didn’t understand that.",
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: Message = {
        type: "ai",
        text: "Oops! Something went wrong.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-80 h-111 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Chat Header */}
            <div className="text-md font-semibold flex justify-between items-center p-3 bg-[#C8A983] text-white">
              <AiFillMessage size={24} />
              <span>Forky - AI Assistant</span>
              <button onClick={() => setIsOpen(false)}>
                <FiX size={24} className="cursor-pointer" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 overflow-y-auto text-sm text-gray-700 flex flex-col gap-2">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`p-2 rounded-xl max-w-[75%] prose prose-sm ${
                    msg.type === "user"
                      ? "self-end bg-[#C8A983] text-white prose-invert"
                      : "self-start bg-gray-200 text-gray-800"
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="self-start bg-gray-200 text-white p-2 rounded-xl"
                >
                  <div className="flex items-center justify-start gap-2">
                    <span className="w-4 h-4 border-2 border-gray-800 border-t-transparent border-l-transparent rounded-full animate-spin inline-block"></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-gray-200 flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (error) setError(false); // remove red border while typing
                }}
                onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
                className={`flex-1 rounded-full px-3 py-2 border-2 focus:outline-none ${
                  error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#C8A983]"
                }`}
              />


              <button
                onClick={sendMessage}
                className="!rounded-full bg-[#C8A983] text-white px-4 py-3 rounded-lg hover:bg-[#B3905E] cursor-pointer transition"
              >
                <FaArrowUp />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-[#C8A983] text-white p-4 rounded-full shadow-lg hover:bg-[#B3905E] transition cursor-pointer"
        >
          <AiFillMessage size={24} />
        </button>
      )}
    </div>
  );
}
