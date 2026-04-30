import Avatar, { getInitials } from '@/components/ui/Avatar';
import RenderMarkdown from '@/components/ui/RenderMarkdown';
import type { ChatMessage } from '@/types';

function formatTime(ts?: string) {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch { return ts; }
}

export default function MessageBubble({ message, prevMessage }: { message: ChatMessage; prevMessage?: ChatMessage }) {
  const isUser = message.role_type === 'user';
  const isAI = message.role_type === 'assistant';
  const showSender = !prevMessage || prevMessage.role_type !== message.role_type;

  return (
    <div style={{
      display: 'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-end', gap: 8,
      marginBottom: showSender ? 12 : 4,
      animation: 'fadeUp 0.25s ease',
    }}>
      {/* Avatar */}
      {showSender
        ? <div style={{ flexShrink: 0 }}>
            {isAI
              ? <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #5F9598, #1D546D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 700 }}>AI</div>
              : <Avatar initials={getInitials(message.senderName || message.role || 'U')} size={28} bg="#1D546D" />
            }
          </div>
        : <div style={{ width: 28, flexShrink: 0 }} />
      }

      <div style={{ maxWidth: '68%', display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', gap: 3 }}>
        {showSender && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: isUser ? 'row-reverse' : 'row' }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: '#374151' }}>{message.senderName || (isAI ? 'AI Assistant' : 'You')}</span>
            <span style={{ fontSize: 11, color: '#AAC0C6' }}>{message.ts || formatTime(message.created_at)}</span>
          </div>
        )}

        {isUser
          ? <div style={{ background: '#1D546D', color: '#fff', padding: '10px 14px', borderRadius: '14px 14px 4px 14px', fontSize: 13.5, lineHeight: '1.55', wordBreak: 'break-word' }}>
              {message.content}
            </div>
          : <div style={{ background: '#fff', border: '1px solid #E8F0F2', borderLeft: '3px solid #5F9598', padding: '10px 14px', borderRadius: '4px 14px 14px 14px', boxShadow: '0 1px 4px rgba(6,30,41,0.06)' }}>
              <RenderMarkdown text={message.content} />
            </div>
        }
      </div>
    </div>
  );
}
