import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Unlock, KeyRound, AlertCircle, X, Shield, Eye, EyeOff } from 'lucide-react';

export const OwnerAuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, unlockOwner, setIsEditModalOpen } = usePortfolio();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Please enter your owner PIN.');
      return;
    }

    const success = unlockOwner(passcode);
    if (success) {
      setPasscode('');
      setError('');
      setIsAuthModalOpen(false);
      setIsEditModalOpen(true);
    } else {
      setError('Incorrect PIN. Access restricted to Sinchana M.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F0F0F] border border-[#333] w-full max-w-md rounded-lg shadow-2xl p-6 sm:p-7 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            setError('');
            setPasscode('');
          }}
          className="absolute top-4 right-4 text-[#888] hover:text-white p-1.5 rounded hover:bg-[#1A1A1A] transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded bg-[#161616] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-serif text-[#F2F2F2]">Owner Authentication</h3>
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#C5A059]">Restricted Access • Sinchana M</p>
          </div>
        </div>

        <p className="text-xs text-[#999] mb-5 leading-relaxed font-sans">
          This administrative console is password-protected to prevent unauthorized modifications. Enter your private owner PIN to manage portfolio content and review visitor inquiries.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#BBB] mb-1.5">
              Owner Security PIN
            </label>
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter secret owner PIN"
                autoFocus
                className="w-full px-4 py-2.5 rounded bg-[#0A0A0A] border border-[#2A2A2A] focus:border-[#C5A059] text-xs text-[#EEE] placeholder-[#555] focus:outline-none transition pr-16"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-2.5 text-xs text-[#777] hover:text-[#BBB] flex items-center gap-1 cursor-pointer"
              >
                {showPasscode ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show</span>
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5 bg-rose-950/20 border border-rose-900/30 px-3 py-1.5 rounded">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="bg-[#121212] border border-[#222] rounded p-3 flex items-center gap-2.5 text-[11px] text-[#777]">
            <Shield className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>End-to-end encrypted session verification enabled.</span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded text-xs font-semibold uppercase tracking-wider border border-[#C5A059] bg-[#C5A059] hover:bg-[#A88243] text-black transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/50"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Unlock Edit Mode</span>
          </button>
        </form>

      </div>
    </div>
  );
};
