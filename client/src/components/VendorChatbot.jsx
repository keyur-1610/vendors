import React, { useState } from "react";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";

const VendorChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm your AI Assistant. Choose a topic or type your question below:",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);

    const response = getBotResponse(input);
    setMessages((prev) => [...prev, response]);
    setInput("");
  };

  const getBotResponse = (message) => {
    const msg = message.toLowerCase();

    if (msg.includes("order")) {
      return {
        text: "🛒 To place an order, go to 'Products', add items to your cart, and then proceed to checkout.",
        sender: "bot",
      };
    } else if (msg.includes("invoice")) {
      return {
        text: "🧾 You can download invoices from the 'Order History' section after placing an order.",
        sender: "bot",
      };
    } else if (msg.includes("price") || msg.includes("cost")) {
      return {
        text: "💡 Pricing tip: Ensure the selling price covers cost + profit margin. Use the profit calculator for suggestions.",
        sender: "bot",
      };
    } else if (msg.includes("help")) {
      return {
        text: "🆘 You can ask me about: placing orders, downloading invoices, pricing tips, or app navigation.",
        sender: "bot",
      };
    } else if (msg.includes("other")) {
      return {
        text: "📞 For other issues, please contact our support: +91 98765 43210 or email support@streetconnect.com",
        sender: "bot",
      };
    } else {
      return {
        text: "🤖 Sorry, I didn’t understand. Try asking about orders, invoices, or pricing. Or click 'Other' for help.",
        sender: "bot",
      };
    }
  };

  const handleQuickOption = (topic) => {
    setInput(topic);
    setTimeout(() => handleSend(), 200);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="w-80 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
          <div className="bg-[#4D7111] text-white p-3 flex justify-between items-center rounded-t-lg">
            <span>🧠 AI Assistant</span>
            <button onClick={toggleChat}>
              <FaTimes />
            </button>
          </div>

          {/* Quick Option Buttons */}
          <div className="p-2 flex flex-wrap gap-2 justify-center border-b">
            {["Order", "Invoice", "Price", "Help", "Other"].map((topic) => (
              <button
                key={topic}
                onClick={() => handleQuickOption(topic)}
                className="bg-[#D1E3FC] text-[#1F4B2C] text-sm px-3 py-1 rounded hover:bg-[#bdd7f5]"
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto max-h-96 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm p-2 rounded ${
                  msg.sender === "bot"
                    ? "bg-[#E4FCEB] text-left"
                    : "bg-[#D1E3FC] text-right"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex border-t p-2">
            <input
              type="text"
              className="flex-1 p-1 border rounded mr-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-[#4D7111] text-white px-3 py-1 rounded"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-[#4D7111] text-white p-4 rounded-full shadow-lg hover:bg-[#3a5c10]"
        >
          <FaRobot size={24} />
        </button>
      )}
    </div>
  );
};

export default VendorChatbot;
