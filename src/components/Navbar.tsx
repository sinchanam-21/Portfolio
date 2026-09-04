import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  FileText, 
  Lock, 
  Unlock, 
  Menu, 
  X, 
  Sliders, 
  Mail, 
  Github, 
  Linkedin,
  Sparkles,
  Inbox,
  Key
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    data, 
    isOwner, 
    lockOwner, 
    setIsAuthModalOpen, 
    setIsResumeModalOpen, 
    setIsEditModalOpen,
    setEditModalTab,
    setIsMessagesDrawerOpen
  } = usePortfolio();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const unreadMessagesCount = data.contactMessages.filter(m => !m.isRead).length;

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top Banner for Owner Mode */}
      {isOwner && (
        <div className="bg-[#161616] border-b border-[#333] text-[#D1D1D1] px-4 py-2 text-xs font-medium flex items-center justify-between shadow-md relative z-50">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 rounded-full bg-[#C5A059] animate-pulse" />
              <span className="text-[11px] uppercase tracking-wider text-[#BBB]">
                <strong className="text-[#F2F2F2]">Owner Mode Active</strong> — Authorized editing & registry management enabled
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setEditModalTab('profile');
                  setIsEditModalOpen(true);
                }}
                className="bg-[#1A1A1A] border border-[#333] hover:border-[#C5A059] text-[#C5A059] hover:text-white px-3 py-1 rounded text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Sliders className="w-3 h-3 text-[#C5A059]" />
                Edit Portfolio
              </button>
              <button
                onClick={() => {
                  setEditModalTab('security');
                  setIsEditModalOpen(true);
                }}
                className="bg-[#1A1A1A] border border-[#333] hover:border-[#C5A059] text-[#EEE] hover:text-white px-2.5 py-1 rounded text-xs transition cursor-pointer flex items-center gap-1.5"
                title="Change Owner Security PIN"
              >
                <Key className="w-3 h-3 text-[#C5A059]" />
                Security PIN
              </button>
              <button
                onClick={() => setIsMessagesDrawerOpen(true)}
                className="relative bg-[#1A1A1A] border border-[#333] hover:border-[#C5A059] text-[#EEE] px-3 py-1 rounded text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Inbox className="w-3 h-3 text-[#C5A059]" />
                Inquiries
                {unreadMessagesCount > 0 && (
                  <span className="bg-[#C5A059] text-[#0A0A0A] rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
              <button
                onClick={lockOwner}
                className="bg-[#1A1A1A] border border-[#333] hover:bg-[#222] text-[#999] hover:text-white px-2.5 py-1 rounded text-xs transition cursor-pointer flex items-center gap-1"
                title="Lock and view as public visitor"
              >
                <Lock className="w-3 h-3" />
                Exit Mode
              </button>
            </div>
          </div>
        </div>
      )}

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0F0F0F]/95 backdrop-blur-md border-b border-[#222] shadow-xl'
            : 'bg-[#0A0A0A]/85 backdrop-blur-sm border-b border-[#1A1A1A]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#home"
            className="group flex items-center gap-3.5 text-[#F2F2F2] transition"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#8E6E3A] flex items-center justify-center font-serif font-bold text-lg text-[#0A0A0A] shadow-md group-hover:scale-105 transition-transform shrink-0">
              S
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-serif tracking-tight text-[#F2F2F2] flex items-center">
                {data.profile.name}
                <span className="text-[#666] font-sans text-xs font-light ml-2 uppercase tracking-[0.2em] hidden sm:inline">
                  Portfolio
                </span>
              </h1>
              <span className="text-[10px] text-[#666] uppercase tracking-[0.25em] font-mono sm:hidden">
                Portfolio
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-widest text-[#999] hover:text-[#C5A059] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-[#C5A059] after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {/* View Resume Button */}
            <button
              id="nav-view-resume-btn"
              onClick={() => setIsResumeModalOpen(true)}
              className="px-3.5 py-1.5 rounded text-xs tracking-wider uppercase border border-[#333] bg-[#1A1A1A] text-[#D1D1D1] hover:border-[#C5A059] hover:text-[#C5A059] transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
              Resume
            </button>

            {/* Owner Edit Mode Toggle */}
            {isOwner ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] border border-[#333] rounded-full">
                  <div className="w-2 h-2 rounded-full bg-[#C5A059]"></div>
                  <span className="text-[10px] uppercase tracking-widest text-[#999]">Admin Active</span>
                </div>
                <button
                  id="nav-owner-controls-btn"
                  onClick={() => {
                    setEditModalTab('profile');
                    setIsEditModalOpen(true);
                  }}
                  className="text-xs border border-[#C5A059] text-[#C5A059] px-3 py-1.5 rounded hover:bg-[#C5A059] hover:text-black transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                  title="Edit profile & projects"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>
            ) : (
              <button
                id="nav-owner-login-btn"
                onClick={() => setIsAuthModalOpen(true)}
                className="text-xs border border-[#333] hover:border-[#C5A059] text-[#999] hover:text-[#C5A059] px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Owner Login (Only for Sinchana)"
              >
                <Lock className="w-3.5 h-3.5 text-[#666]" />
                <span className="text-[11px] uppercase tracking-wider">Owner</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="p-2 text-xs text-[#C5A059] bg-[#1A1A1A] rounded border border-[#333]"
              title="Resume"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-[#999] hover:text-[#F2F2F2] hover:bg-[#1A1A1A] transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0F0F0F] border-b border-[#222] px-4 pt-3 pb-6 space-y-3">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs uppercase tracking-widest text-[#999] hover:text-[#C5A059] hover:bg-[#1A1A1A] rounded transition"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="pt-3 border-t border-[#222] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsResumeModalOpen(true);
                }}
                className="w-full py-2.5 rounded text-xs uppercase tracking-wider font-semibold border border-[#333] bg-[#1A1A1A] text-[#C5A059] flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#C5A059]" />
                View Resume
              </button>
              {isOwner ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsEditModalOpen(true);
                    }}
                    className="flex-1 py-2 rounded text-xs border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      lockOwner();
                    }}
                    className="py-2 px-3 rounded text-xs bg-[#1A1A1A] border border-[#333] text-[#999] hover:text-white"
                  >
                    <Lock className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full py-2 rounded text-xs uppercase tracking-widest text-[#999] hover:text-[#C5A059] bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Owner Access
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
