'use client';
import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { PanelRightOpen, PanelRightClose } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from '@/components/ui/TypingIndicator';
import Spinner from '@/components/ui/Spinner';
import { sendMessage } from '@/api/chat';
import { useAuthStore } from '@/store/authStore';
import type { ChatMessage, Project } from '@/types';

export default function ChatPanel({ project, panelOpen, onTogglePanel }: { project: Project; panelOpen?: boolean; onTogglePanel?: () => void }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      role_type: 'user',
      content: text,
      senderName: user?.name || 'You',
      ts: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const response = await sendMessage(project.id, text);
      const aiMsg: ChatMessage = {
        role_type: 'assistant',
        content: response.reply,
        senderName: 'AI Assistant',
        ts: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errMsg: ChatMessage = {
        role_type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        senderName: 'AI Assistant',
        ts: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'; }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #E8EFF1', background: '#FAFCFC', overflow: 'hidden' }}>
      {/* Chat header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #E8EFF1', background: '#fff', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #EBF3F5, #D0E7ED)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M2 12 C2 12 3 9 8 9 C13 9 14 12 14 12" stroke="#1D546D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <circle cx="8" cy="5" r="2.5" fill="#5F9598" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#061E29', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.name}</h2>
          <p style={{ margin: 0, fontSize: 12, color: '#4A5568', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.description}</p>
        </div>
        {onTogglePanel && (
          <button
            onClick={onTogglePanel}
            title={panelOpen ? 'Close panel' : 'Open panel'}
            style={{
              width: 32, height: 32, borderRadius: 8, border: '1px solid #E8EFF1',
              background: panelOpen ? '#F0F6F8' : '#fff',
              color: panelOpen ? '#1D546D' : '#8DA5AE',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s', flexShrink: 0,
            }}
          >
            {panelOpen
              ? <PanelRightClose size={15} strokeWidth={2} />
              : <PanelRightOpen size={15} strokeWidth={2} />
            }
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', margin: 'auto', color: '#4B5563', fontSize: 13 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
            <p>No messages yet. Ask the AI anything about this project!</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} prevMessage={messages[i - 1]} />
          ))
        )}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div style={{ padding: '12px 20px 16px', borderTop: '1px solid #E8EFF1', background: '#fff', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: '#F4F8F9', borderRadius: 12, padding: '8px 8px 8px 16px', border: '1.5px solid #E0ECEF' }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask the AI anything about this project…"
            rows={1}
            disabled={isTyping}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none', resize: 'none',
              fontSize: 13.5, fontFamily: 'inherit', color: '#061E29', lineHeight: '1.5',
              maxHeight: 120, minHeight: 24, opacity: isTyping ? 0.5 : 1,
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            style={{
              width: 36, height: 36, borderRadius: 9, border: 'none',
              background: input.trim() && !isTyping ? '#1D546D' : '#D8E8EC',
              color: '#fcf9f9', cursor: input.trim() && !isTyping ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s', flexShrink: 0,
            }}
          >
            {isTyping
              ? <Spinner size={14} color="#8DA5AE" />
              : <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7 L12 7 M8 3 L12 7 L8 11" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            }
          </button>
        </div>
        <div style={{ fontSize: 11, color: '#4B5563', marginTop: 6, paddingLeft: 4 }}>
          Enter to send · Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
