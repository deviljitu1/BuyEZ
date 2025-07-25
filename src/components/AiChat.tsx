import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createPortal } from 'react-dom';
import botImage from '../assets/bot.png';

export const AiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "Hi! I'm your shopping assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, isUser: true }]);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Thanks for your message! I'm a demo AI assistant. In the real implementation, I would provide helpful responses about products, orders, and shopping assistance.",
        isUser: false
      }]);
    }, 1000);

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
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 text-sm"
              />
              <Button type="submit" size="icon" className="h-8 w-8">
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