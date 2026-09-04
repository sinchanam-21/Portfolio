import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  X, 
  Inbox, 
  Mail, 
  Trash2, 
  Check, 
  Clock, 
  User, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const OwnerMessagesDrawer: React.FC = () => {
  const { 
    data, 
    isOwner, 
    isMessagesDrawerOpen, 
    setIsMessagesDrawerOpen,
    markMessageRead,
    deleteMessage 
  } = usePortfolio();

  if (!isMessagesDrawerOpen || !isOwner) return null;

  const messages = data.contactMessages || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="bg-[#0F0F0F] border-l border-[#222] w-full max-w-lg h-full shadow-2xl flex flex-col">
        
        {/* Drawer Header */}
        <div className="bg-[#0A0A0A] px-6 py-4 border-b border-[#222] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#161616] border border-[#C5A059]/40 text-[#C5A059]">
              <Inbox className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base text-[#F2F2F2]">Contact Form Inquiries</h3>
              <p className="text-[11px] font-mono text-[#888]">{messages.length} message(s) stored</p>
            </div>
          </div>

          <button
            onClick={() => setIsMessagesDrawerOpen(false)}
            className="p-1.5 rounded text-[#888] hover:text-white hover:bg-[#1A1A1A] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-16 space-y-3 text-[#666]">
              <MessageSquare className="w-10 h-10 mx-auto stroke-1 text-[#444]" />
              <p className="text-sm font-serif text-[#999]">No contact inquiries received yet.</p>
              <p className="text-xs text-[#666] max-w-xs mx-auto">
                Submissions from the Contact form on your portfolio will be saved here securely for your review.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded border transition-all ${
                  msg.isRead 
                    ? 'bg-[#141414] border-[#222] text-[#AAA]' 
                    : 'bg-[#141414] border-[#C5A059]/50 text-[#F2F2F2] shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-[#222]">
                  <div>
                    <span className="font-serif font-bold text-sm text-[#F2F2F2] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#C5A059]" />
                      {msg.name}
                    </span>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-[#C5A059] hover:underline block mt-0.5"
                    >
                      {msg.email}
                    </a>
                  </div>
                  <span className="text-[10px] text-[#666] font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {msg.timestamp}
                  </span>
                </div>

                <div className="text-xs font-semibold text-[#BBB] mb-1">
                  Subject: <span className="text-[#EEE]">{msg.subject}</span>
                </div>

                <p className="text-xs text-[#BBB] bg-[#0A0A0A] p-3 rounded border border-[#222] mb-3 whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#222] text-xs">
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="px-2.5 py-1 rounded text-xs border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black flex items-center gap-1 font-medium transition"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Reply</span>
                    </a>

                    {!msg.isRead && (
                      <button
                        onClick={() => markMessageRead(msg.id)}
                        className="px-2.5 py-1 rounded bg-[#1A1A1A] border border-[#333] text-[#BBB] hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>Mark Read</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="p-1 text-[#666] hover:text-rose-400 cursor-pointer"
                    title="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
