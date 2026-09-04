import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Github, 
  Linkedin, 
  FileText,
  Copy,
  Check
} from 'lucide-react';

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export const Contact: React.FC = () => {
  const { data, submitContactMessage, setIsResumeModalOpen } = usePortfolio();
  const { profile } = data;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email format (e.g., name@example.com).';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please enter a message subject.';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject should be at least 3 characters.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please write your message.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitContactMessage(formData);
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    }, 600);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section id="contact" className="py-20 bg-[#0D0D0D] border-t border-[#222] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#666] font-mono block mb-2">
            05 // Inquiry & Dispatch
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#F2F2F2] tracking-tight">
            Connect & Professional Collaboration
          </h2>
          <p className="text-[#999] text-xs mt-2 font-sans">
            Discuss software engineering positions, AI/ML research collaborations, or technical projects. Messages are logged directly to the owner console.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Direct Contact Info & Socials */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Email Card */}
            <div className="bg-[#0F0F0F] border border-[#222] hover:border-[#333] rounded-lg p-4 sm:p-5 flex items-center justify-between shadow-md group">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded bg-[#161616] border border-[#2A2A2A] text-[#C5A059]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#666] font-mono">Email Address</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-xs font-semibold text-[#EEE] hover:text-[#C5A059] transition"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(profile.email, 'email')}
                className="p-2 text-[#666] hover:text-[#C5A059] rounded hover:bg-[#1A1A1A] transition cursor-pointer"
                title="Copy email"
              >
                {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-[#C5A059]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Phone Card */}
            <div className="bg-[#0F0F0F] border border-[#222] hover:border-[#333] rounded-lg p-4 sm:p-5 flex items-center justify-between shadow-md group">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded bg-[#161616] border border-[#2A2A2A] text-[#C5A059]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#666] font-mono">Direct Mobile</p>
                  <a
                    href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-xs font-semibold text-[#EEE] hover:text-[#C5A059] transition"
                  >
                    {profile.phone}
                  </a>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(profile.phone, 'phone')}
                className="p-2 text-[#666] hover:text-[#C5A059] rounded hover:bg-[#1A1A1A] transition cursor-pointer"
                title="Copy phone number"
              >
                {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-[#C5A059]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Location Card */}
            <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-4 sm:p-5 flex items-center gap-3.5 shadow-md">
              <div className="p-2.5 rounded bg-[#161616] border border-[#2A2A2A] text-[#C5A059]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#666] font-mono">Location & Region</p>
                <p className="text-xs font-semibold text-[#EEE]">
                  {profile.location}
                </p>
              </div>
            </div>

            {/* Resume & Profiles Card */}
            <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-6 shadow-md">
              <h4 className="text-xs font-serif font-bold text-[#F2F2F2] uppercase tracking-wider mb-2">
                Executive Dossier & Network
              </h4>
              <p className="text-xs text-[#999] mb-4">
                Access Sinchana M's complete curriculum vitae, code repositories, and professional network.
              </p>

              <div className="space-y-2.5">
                <button
                  id="contact-view-resume-btn"
                  onClick={() => setIsResumeModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded text-xs font-medium bg-[#1A1A1A] hover:bg-[#222] text-[#EEE] border border-[#333] hover:border-[#C5A059] hover:text-[#C5A059] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#C5A059]" />
                  <span>View Executive Resume</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded text-xs font-medium bg-[#1A1A1A] hover:bg-[#222] text-[#BBB] hover:text-white border border-[#2A2A2A] hover:border-[#C5A059] transition flex items-center justify-center gap-1.5"
                  >
                    <Github className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded text-xs font-medium bg-[#1A1A1A] hover:bg-[#222] text-[#BBB] hover:text-white border border-[#2A2A2A] hover:border-[#C5A059] transition flex items-center justify-center gap-1.5"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form with Validation */}
          <div className="lg:col-span-7">
            <div className="bg-[#0F0F0F] border border-[#222] rounded-lg p-6 sm:p-8 shadow-xl relative">
              <h3 className="text-xl font-serif text-[#F2F2F2] mb-1.5">
                Direct Inquiry Form
              </h3>
              <p className="text-xs text-[#999] mb-6">
                All inquiries are validated and stored in your authenticated owner message center.
              </p>

              {isSuccess ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-12 h-12 bg-[#1A1A1A] border border-[#C5A059] text-[#C5A059] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-serif font-bold text-[#F2F2F2]">Message Dispatched</h4>
                  <p className="text-xs text-[#BBB] max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Sinchana has received your dispatch and will review it in the owner dashboard.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-2 px-5 py-2 rounded text-xs font-medium border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition cursor-pointer"
                  >
                    Send Another Dispatch
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="contact-name" className="block text-[11px] uppercase tracking-wider font-semibold text-[#BBB] mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        id="contact-name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        placeholder="e.g. Aditi Sharma"
                        className={`w-full px-4 py-2.5 rounded bg-[#0A0A0A] border text-xs text-[#EEE] placeholder-[#555] focus:outline-none transition ${
                          errors.name
                            ? 'border-rose-500 focus:border-rose-500'
                            : 'border-[#2A2A2A] focus:border-[#C5A059]'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="contact-email" className="block text-[11px] uppercase tracking-wider font-semibold text-[#BBB] mb-1.5">
                        Your Email Address *
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        placeholder="e.g. aditi@example.com"
                        className={`w-full px-4 py-2.5 rounded bg-[#0A0A0A] border text-xs text-[#EEE] placeholder-[#555] focus:outline-none transition ${
                          errors.email
                            ? 'border-rose-500 focus:border-rose-500'
                            : 'border-[#2A2A2A] focus:border-[#C5A059]'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label htmlFor="contact-subject" className="block text-[11px] uppercase tracking-wider font-semibold text-[#BBB] mb-1.5">
                      Subject / Topic *
                    </label>
                    <input
                      type="text"
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                        if (errors.subject) setErrors({ ...errors, subject: undefined });
                      }}
                      placeholder="e.g. AI Internship Opportunity / Technical Collaboration"
                      className={`w-full px-4 py-2.5 rounded bg-[#0A0A0A] border text-xs text-[#EEE] placeholder-[#555] focus:outline-none transition ${
                        errors.subject
                          ? 'border-rose-500 focus:border-rose-500'
                            : 'border-[#2A2A2A] focus:border-[#C5A059]'
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.subject}</span>
                      </p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="contact-message" className="block text-[11px] uppercase tracking-wider font-semibold text-[#BBB] mb-1.5">
                      Message Content *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      placeholder="Share details regarding your query or project collaboration..."
                      className={`w-full px-4 py-2.5 rounded bg-[#0A0A0A] border text-xs text-[#EEE] placeholder-[#555] focus:outline-none transition resize-none ${
                        errors.message
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-[#2A2A2A] focus:border-[#C5A059]'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    id="contact-submit-btn"
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 rounded text-xs font-semibold uppercase tracking-wider border border-[#C5A059] bg-[#C5A059] text-black hover:bg-[#A88243] hover:border-[#A88243] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/50 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Transmitting Message...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Transmit Message</span>
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
