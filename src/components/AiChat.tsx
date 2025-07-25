import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Trash2, Loader2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createPortal } from 'react-dom';
import botImage from '../assets/bot.png';

// --- API Configuration ---
const API_CONFIG = {
  openRouter: {
    key: import.meta.env.VITE_OPENROUTER_API_KEY || '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',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'mistralai/mistral-7b-instruct',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY || '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'}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.href : 'https://example.com',
      'X-Title': 'Shopping Assistant'
    }
  },
  gemini: {
    key: import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCR2qkH4DXw4jBXbT94YnAOgwaSD6r-rBI',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
  }
};

// Message typing
type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

async function fetchAIResponse(messages: Message[]): Promise<string> {
  // Format messages for API
  const formattedMessages = messages.slice(-10).map(m => ({
    role: m.isUser ? 'user' : 'assistant',
    content: m.text
  }));

  // Try OpenRouter first
  try {
    const response = await fetch(API_CONFIG.openRouter.endpoint, {
      method: 'POST',
      headers: API_CONFIG.openRouter.headers,
      body: JSON.stringify({
        model: API_CONFIG.openRouter.model,
        messages: formattedMessages,
      }),
    });

    if (!response.ok) throw new Error(`OpenRouter error: ${response.status}`);
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "I didn't get a response. Can you try again?";
  } catch (error) {
    console.error('OpenRouter failed:', error);
    
    // Fallback to Gemini
    try {
      const response = await fetch(
        `${API_CONFIG.gemini.endpoint}?key=${API_CONFIG.gemini.key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: formattedMessages.map(m => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }]
            }))
          }),
        }
      );

      if (!response.ok) throw new Error(`Gemini error: ${response.status}`);
      
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "I didn't get a response. Can you try again?";
    } catch (geminiError) {
      console.error('Gemini failed:', geminiError);
      return "I'm having trouble connecting right now. Please try again later.";
    }
  }
}

export const AiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: crypto.randomUUID(),
      text: "Hi! I'm your shopping assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Send message function
  const sendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim() || loading) return;
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: userInput,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput('');
    setError(null);

    try {
      // Get AI response with conversation context
      const aiResponse = await fetchAIResponse([...messages, userMessage]);
      
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setError("Sorry, I'm having technical issues. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [loading, messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input.trim());
  };

  const clearChat = () => {
    setMessages([
      { 
        id: crypto.randomUUID(),
        text: "Hi! I'm your shopping assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date()
      }
    ]);
    setError(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-3 right-3 w-14 h-14 flex items-center justify-center"
        style={{ zIndex: 999998 }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <div className="w-10 h-10 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center">
            <X className="w-6 h-6 text-primary" />
          </div>
        ) : (
          <img
            src={botImage}
            alt="AI Chat Assistant"
            className="w-14 h-14 transition-all duration-200 hover:scale-105 rounded-full shadow-md"
          />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && createPortal(
        <div 
          className="fixed bottom-20 right-3 w-80 max-w-[calc(100vw-1rem)] h-[400px] max-h-[calc(100vh-7rem)] bg-white rounded-2xl shadow-2xl flex flex-col border animate-in slide-in-from-bottom-10 duration-300"
          style={{ zIndex: 999999 }}
          role="dialog"
          aria-labelledby="chat-header"
        >
          {/* Header */}
          <div className="p-3 border-b flex items-center justify-between bg-primary/5 rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 id="chat-header" className="font-semibold text-sm">Shopping Assistant</h3>
                <p className="text-[10px] text-muted-foreground">Always here to help</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-muted-foreground"
              onClick={clearChat}
              aria-label="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm relative ${
                    msg.isUser
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted rounded-bl-none'
                  }`}
                >
                  {msg.text}
                  <span className={`text-xs opacity-70 block mt-1 ${msg.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-xl px-3 py-2 text-sm bg-muted flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Thinking...
                </div>
              </div>
            )}
            
            {error && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-xl px-3 py-2 text-sm bg-destructive/10 text-destructive-foreground border border-destructive/20">
                  {error}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 text-sm"
                disabled={loading}
                aria-label="Type your message"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim()) handleSend(e);
                  }
                }}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="h-8 w-8" 
                disabled={loading || !input.trim()}
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </form>
        </div>,
        document.body
      )}
    </>
  );
};