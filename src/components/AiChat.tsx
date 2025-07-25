import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createPortal } from 'react-dom';
import botImage from '../assets/bot.png';

// --- Add your API keys here ---
const GEMINI_API_KEY = 'AIzaSyCR2qkH4DXw4jBXbT94YnAOgwaSD6r-rBI';
const OPENROUTER_API_KEY = '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';
// ------------------------------

async function fetchOpenRouterResponse(prompt: string): Promise<string | null> {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo', // Use a free model
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content.trim();
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchGeminiResponse(prompt: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
    const data = await res.json();
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }
    return null;
  } catch {
    return null;
  }
}

export const AiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "Hi! I'm your shopping assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (userInput: string) => {
    setMessages(prev => [...prev, { text: userInput, isUser: true }]);
    setLoading(true);

    // Try OpenRouter first, fallback to Gemini if fails
    let aiResponse = await fetchOpenRouterResponse(userInput);
    if (!aiResponse) {
      aiResponse = await fetchGeminiResponse(userInput);
    }
    if (!aiResponse) {
      aiResponse = "Sorry, I'm unable to respond right now. Please try again later.";
    }

    setMessages(prev => [...prev, { text: aiResponse, isUser: false }]);
    setLoading(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-3 right-3 w-14 h-14 flex items-center justify-center"
        style={{ zIndex: 999998 }}
      >
        {isOpen ? (
          <div className="w-10 h-10 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center">
            <X className="w-6 h-6 text-primary" />
          </div>
        ) : (
          <img
            src={botImage}
            alt="AI Chat Assistant"
            className="w-14 h-14 transition-all duration-200 hover:scale-105"
          />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && createPortal(
        <div 
          className="fixed bottom-20 right-3 w-80 max-w-[calc(100vw-1rem)] h-[350px] max-h-[calc(100vh-7rem)] bg-white rounded-2xl shadow-2xl flex flex-col border animate-in slide-in-from-bottom-10 duration-300"
          style={{ zIndex: 999999 }}
        >
          {/* Header */}
          <div className="p-3 border-b flex items-center justify-between bg-primary/5">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full overflow-hidden">
                <img
                  src={botImage}
                  alt="AI Chat Assistant"
                  className="w-full h-full"
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Shopping Assistant</h3>
                <p className="text-[10px] text-muted-foreground">Always here to help</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    msg.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-xl px-3 py-2 text-sm bg-muted opacity-70">
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 text-sm"
                disabled={loading}
              />
              <Button type="submit" size="icon" className="h-8 w-8" disabled={loading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>,
        document.body
      )}
    </>
  );
};