import React, { useState, useRef, useEffect } from 'react';
import './NITroBot.css';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const NITroBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I am NITroBot, your NIT Durgapur Marketplace Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        // This is a direct fetch to Google Gemini API (Free tier)
        try {
            if (!GEMINI_API_KEY) {
                setTimeout(() => {
                    setMessages(prev => [...prev, { 
                        role: 'bot', 
                        text: "To enable me, please add REACT_APP_GEMINI_API_KEY to your Vercel Environment Variables and redeploy! (I'm currently waiting for the key)." 
                    }]);
                    setLoading(false);
                }, 1000);
                return;
            }

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are NITroBot, the official AI Assistant for NITroCart (a marketplace for students at NIT Durgapur). 
                            Answer questions about buying/selling at NIT Durgapur. 
                            If asked for price suggestions: 
                            - Cycles: ₹1500-4000
                            - Books: 40-70% of MRP
                            - Electronics: Depends on condition.
                            Current user message: ${userMsg}`
                        }]
                    }]
                })
            });

            const data = await response.json();
            const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble connecting right now. Please try again soon!";
            
            setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', text: "Service error. Check your API key and connection." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`nitro-bot-container ${isOpen ? 'open' : ''}`}>
            {/* Toggle Button */}
            <button className="nitro-bot-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : <i className="fas fa-robot"></i>}
                {!isOpen && <span className="nitro-pulse"></span>}
            </button>

            {/* Chat Window */}
            <div className="nitro-chat-window">
                <div className="nitro-chat-header">
                    <div className="nitro-header-info">
                        <i className="fas fa-robot"></i>
                        <div>
                            <h4>NITroBot</h4>
                            <span>AI Assistant (DBMS + ML)</span>
                        </div>
                    </div>
                </div>

                <div className="nitro-chat-messages">
                    {messages.map((m, i) => (
                        <div key={i} className={`nitro-message ${m.role}`}>
                            <div className="nitro-bubble">
                                {m.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="nitro-message bot">
                            <div className="nitro-bubble nitro-typing">
                                <span>.</span><span>.</span><span>.</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="nitro-chat-input">
                    <input 
                        type="text" 
                        placeholder="Ask anything..." 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={handleSend} disabled={loading}>
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NITroBot;
