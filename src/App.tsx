import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Certifications } from './components/Certifications';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { OwnerAuthModal } from './components/OwnerAuthModal';
import { OwnerEditModal } from './components/OwnerEditModal';
import { OwnerMessagesDrawer } from './components/OwnerMessagesDrawer';
import { NotificationToast } from './components/NotificationToast';

export default function App() {
  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-[#0A0A0A] text-[#D1D1D1] flex flex-col selection:bg-[#C5A059] selection:text-[#0A0A0A]">
        {/* Navigation Bar with Owner Status */}
        <Navbar />

        {/* Main Content Sections */}
        <main className="flex-1">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Certifications />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />

        {/* Modals & Overlays */}
        <ResumeModal />
        <OwnerAuthModal />
        <OwnerEditModal />
        <OwnerMessagesDrawer />
        <NotificationToast />
      </div>
    </PortfolioProvider>
  );
}
