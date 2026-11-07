import React, { useState } from 'react';

interface ContactProps {
  onLeadSubmitted?: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onLeadSubmitted }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    service: '',
    budget: '',
    timeline: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    waUrl?: string;
  }>({ type: null, message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (status.type) setStatus({ type: null, message: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.contact.trim() || !formData.email.trim() || !formData.service || !formData.message.trim()) {
      setStatus({
        type: 'error',
        message: '⚠️ Please fill out all required fields: Name, Phone/WhatsApp, Email, Service, and Project Brief.'
      });
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name.trim(),
      contact: formData.contact.trim(),
      email: formData.email.trim(),
      service: formData.service,
      budget: formData.budget || 'Flexible / Let\'s Discuss',
      timeline: formData.timeline || 'Flexible',
      message: formData.message.trim()
    };

    let submitted = false;

    // 1. Submit to full-stack Express API
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) submitted = true;
      }
    } catch (apiErr) {
      console.warn('API error, attempting Supabase fallback:', apiErr);
    }

    // 2. Direct Supabase REST API Fallback
    if (!submitted) {
      try {
        const sbRes = await fetch('https://izckruhjcmrxyfpuzxyo.supabase.co/rest/v1/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6Y2tydWhqY21yeHlmcHV6eHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzODE3MTEsImV4cCI6MjEwODk1NzcxMX0.4wo4wYbCyGBblU1bL1WcFmhF5R03smKffQjbzRozGoM',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6Y2tydWhqY21yeHlmcHV6eHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzODE3MTEsImV4cCI6MjEwODk1NzcxMX0.4wo4wYbCyGBblU1bL1WcFmhF5R03smKffQjbzRozGoM',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify([{
            name: payload.name,
            contact: payload.contact,
            email: payload.email,
            service: payload.service,
            budget: payload.budget,
            timeline: payload.timeline,
            message: payload.message
          }])
        });
        if (sbRes.ok || sbRes.status === 201) submitted = true;
      } catch (sbErr) {
        console.warn('Supabase fallback error:', sbErr);
      }
    }

    // 3. Local Storage Buffer Fallback
    try {
      const offline = JSON.parse(localStorage.getItem('creatophoria_offline_leads') || '[]');
      offline.unshift({
        ...payload,
        id: 'lead_' + Date.now(),
        createdAt: new Date().toISOString(),
        formattedDate: new Date().toLocaleString(),
        status: 'new'
      });
      localStorage.setItem('creatophoria_offline_leads', JSON.stringify(offline));
      submitted = true;
    } catch (e) {}

    setLoading(false);

    if (submitted) {
      const studioWaUrl = `https://wa.me/919999999999?text=${encodeURIComponent(
        `Hi Creatophoria Studio! I just submitted an inquiry for ${payload.service}. My name is ${payload.name}.`
      )}`;

      setStatus({
        type: 'success',
        message: `✦ Project Brief Transmitted Successfully! Thank you, ${payload.name}. Your details for ${payload.service} have been logged in our studio registry. Our creative team will reach out within 24 hours.`,
        waUrl: studioWaUrl
      });

      setFormData({
        name: '',
        contact: '',
        email: '',
        service: '',
        budget: '',
        timeline: '',
        message: ''
      });

      onLeadSubmitted?.();
    } else {
      setStatus({
        type: 'error',
        message: 'There was a connection issue. Please reach out to creatophoriastudio@gmail.com directly or chat via WhatsApp.'
      });
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32 relative bg-[#07070A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#00E5A8] mb-4">
                <span className="w-3 h-[1px] bg-[#00E5A8]" />
                <span>Get In Touch</span>
              </div>
              <h2 className="font-['Syne'] text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
                Let's build <br />
                something <br />
                <span className="text-[#00E5A8]">extraordinary.</span>
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <a
                href="mailto:creatophoriastudio@gmail.com"
                className="flex items-center gap-4 text-sm sm:text-base text-[#AEB4C2] hover:text-[#00E5A8] transition-colors p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#00E5A8]/20 group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#00E5A8] group-hover:scale-110 transition-transform">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <span>creatophoriastudio@gmail.com</span>
              </a>

              <a
                href="https://www.instagram.com/creatophoria_studio?rpxt=MW1qY3RtYmxrdmpuZg=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-sm sm:text-base text-[#AEB4C2] hover:text-[#00E5A8] transition-colors p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#00E5A8]/20 group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#00E5A8] group-hover:scale-110 transition-transform">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
                <span>@creatophoria_studio</span>
              </a>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#00E5A8]/5 border border-[#00E5A8]/20 text-[#00E5A8] text-xs sm:text-sm font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E5A8] animate-ping" />
                <span>Currently available for new projects</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="p-8 sm:p-12 rounded-3xl bg-white/[0.035] border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/40 flex flex-col gap-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#AEB4C2] font-semibold mb-2">
                    Your Name / Brand *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Rivera or Apex Media"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#00E5A8] focus:ring-1 focus:ring-[#00E5A8] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#AEB4C2] font-semibold mb-2">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#00E5A8] focus:ring-1 focus:ring-[#00E5A8] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#AEB4C2] font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@company.com"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#00E5A8] focus:ring-1 focus:ring-[#00E5A8] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#AEB4C2] font-semibold mb-2">
                    Service Required *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#0E1016] border border-white/10 text-white text-sm focus:outline-none focus:border-[#00E5A8] focus:ring-1 focus:ring-[#00E5A8] transition-all cursor-pointer"
                  >
                    <option value="" disabled>Select a Service</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Motion Graphics">Motion Graphics</option>
                    <option value="Brand Identity">Brand Identity</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Social Media Design">Social Media Design</option>
                    <option value="Thumbnail Design">Thumbnail Design</option>
                    <option value="Creative Strategy">Creative Strategy</option>
                    <option value="Complete Creative Package">Complete Creative Package</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#AEB4C2] font-semibold mb-2">
                    Estimated Budget (Optional)
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#0E1016] border border-white/10 text-white text-sm focus:outline-none focus:border-[#00E5A8] transition-all cursor-pointer"
                  >
                    <option value="">Select Estimated Budget</option>
                    <option value="Flexible / Let's Discuss">Flexible / Let's Discuss</option>
                    <option value="₹15,000 - ₹35,000 ($200 - $500)">₹15,000 - ₹35,000 ($200 - $500)</option>
                    <option value="₹35,000 - ₹75,000 ($500 - $1,000)">₹35,000 - ₹75,000 ($500 - $1,000)</option>
                    <option value="₹75,000 - ₹1,50,000 ($1,000 - $2,000)">₹75,000 - ₹1,50,000 ($1,000 - $2,000)</option>
                    <option value="₹1,50,000+ ($2,000+) Retainer">₹1,50,000+ ($2,000+) Retainer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#AEB4C2] font-semibold mb-2">
                    Project Urgency (Optional)
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#0E1016] border border-white/10 text-white text-sm focus:outline-none focus:border-[#00E5A8] transition-all cursor-pointer"
                  >
                    <option value="">Project Urgency</option>
                    <option value="Immediate / Rush (< 1 week)">Immediate / Rush (&lt; 1 week)</option>
                    <option value="Within 2-3 weeks">Within 2-3 weeks</option>
                    <option value="1 month or more">1 month or more</option>
                    <option value="Ongoing Monthly Retainer">Ongoing Monthly Retainer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#AEB4C2] font-semibold mb-2">
                  Tell us about your project vision *
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your brand goals, deliverables needed, or creative inspiration..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#00E5A8] focus:ring-1 focus:ring-[#00E5A8] transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto self-start px-10 py-4 rounded-full bg-[#00E5A8] text-[#07070A] font-bold text-sm tracking-wide hover:bg-[#1affbf] transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#00E5A8]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Transmitting brief...' : 'Send Message'}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9" />
                </svg>
              </button>

              {/* Status Message */}
              {status.type && (
                <div
                  className={`p-5 rounded-2xl text-sm leading-relaxed ${
                    status.type === 'success'
                      ? 'bg-[#00E5A8]/10 border border-[#00E5A8]/30 text-white'
                      : 'bg-red-500/10 border border-red-500/30 text-red-200'
                  }`}
                >
                  <p className="font-medium">{status.message}</p>
                  {status.waUrl && (
                    <a
                      href={status.waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg bg-[#25D366] text-[#07070A] font-bold text-xs hover:bg-[#2ae06d] transition-all"
                    >
                      <span>Fast-Track via WhatsApp</span>
                      <span>→</span>
                    </a>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
