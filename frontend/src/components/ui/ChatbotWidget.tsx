import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import apiClient from '../../api/client';
import styles from './ChatbotWidget.module.css';

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  products?: { name: string; price: string; desc: string }[];
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'english' | 'hindi' | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleLanguageSelect = (lang: 'english' | 'hindi') => {
    setLanguage(lang);
    setMessages([
      { 
        id: '1', 
        sender: 'bot', 
        text: lang === 'english' ? 'Hello! How can I help you today?' : 'नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूँ?' 
      },
    ]);
  };

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/api/chat', { message: userMessage.text, language });
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.data.data.answer,
        products: response.data.data.products,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Connection Error. Is the backend running?';
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'bot', text: `⚠️ Error: ${errorMsg}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={styles.chatbotWidget}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageCircle size={20} /> Support Assistant
            </span>
            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <div className={styles.chatBody}>
            {!language ? (
              <div className={styles.languageContainer}>
                <div className={styles.languageTitle}>Please select your language <br/> कृपया अपनी भाषा चुनें</div>
                <div className={styles.languageButtons}>
                  <button className={styles.langButton} onClick={() => handleLanguageSelect('english')}>English</button>
                  <button className={styles.langButton} onClick={() => handleLanguageSelect('hindi')}>हिंदी</button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div className={`${styles.chatMsg} ${msg.sender === 'user' ? styles.msgUser : styles.msgBot}`}>
                  {msg.text}
                </div>
                {msg.products && msg.products.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                    {msg.products.map((p, idx) => (
                      <div key={idx} className={styles.productCard}>
                        <div className={styles.productName}>{p.name}</div>
                        <div className={styles.productPrice}>{p.price}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{p.desc}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className={styles.typingIndicator}>{language === 'hindi' ? 'सहायक टाइप कर रहा है...' : 'Assistant is typing...'}</div>
            )}
            <div ref={messagesEndRef} />
              </>
            )}
          </div>
          {language && (
            <div className={styles.chatInputArea}>
              <input
                type="text"
                className={styles.chatInput}
                placeholder={language === 'hindi' ? 'उत्पादों के बारे में पूछें...' : 'Ask about products...'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button className={styles.chatSend} onClick={handleSend} disabled={isLoading}>
                {language === 'hindi' ? 'भेजें' : 'Send'}
              </button>
            </div>
          )}
        </div>
      )}

      {!isOpen && (
        <button className={styles.chatToggle} onClick={() => setIsOpen(true)}>
          <MessageCircle size={32} />
        </button>
      )}
    </div>
  );
}
