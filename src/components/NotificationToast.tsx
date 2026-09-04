import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notification } = usePortfolio();

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`px-4 py-3 rounded-lg shadow-2xl border flex items-center gap-2.5 text-xs font-medium backdrop-blur-md ${
          notification.type === 'error'
            ? 'bg-[#1C1212] border-rose-900/60 text-rose-300'
            : notification.type === 'info'
            ? 'bg-[#141414] border-[#333] text-[#EEE]'
            : 'bg-[#141414] border-[#C5A059]/50 text-[#F2F2F2]'
        }`}
      >
        {notification.type === 'error' ? (
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
        ) : notification.type === 'info' ? (
          <Info className="w-4 h-4 text-[#C5A059] shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
        )}
        <span>{notification.message}</span>
      </div>
    </div>
  );
};
