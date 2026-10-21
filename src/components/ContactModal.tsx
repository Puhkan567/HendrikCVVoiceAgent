import React, { useState } from 'react';
import { X, Calendar, Send, CheckCircle2, User, Building, Mail, Phone } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
  language: 'en' | 'et';
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, defaultTopic, language }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState(defaultTopic || (language === 'et' ? 'Töövestluse aeg' : 'Interview Scheduling'));
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          company,
          email,
          phone,
          topic,
          message,
          language,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert(
          language === 'et'
            ? 'Andmete saatmine ebaõnnestus. Palun kirjutage otse aadressile hendrik.puhkan@gmail.com.'
            : 'Could not submit details at this moment. Please email hendrik.puhkan@gmail.com directly.'
        );
      }
    } catch (err) {
      console.error('Contact error:', err);
      alert(
        language === 'et'
          ? 'Andmete saatmine ebaõnnestus. Palun kirjutage otse aadressile hendrik.puhkan@gmail.com.'
          : 'Could not submit details at this moment. Please email hendrik.puhkan@gmail.com directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden transition-colors duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {language === 'et' ? 'Kontaktandmed edastatud!' : 'Details Received'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-sm mx-auto">
              {language === 'et'
                ? 'Tänan huvi tundmast! Hendrik vaatab teie teate läbi ning kinnitab töövestluse aja otse teiega.'
                : 'Thank you for reaching out. Hendrik will review your note and confirm interview availability directly.'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                {language === 'et' ? 'Tagasi assistendi juurde' : 'Back to Assistant'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === 'et' ? 'Võta Hendrikuga ühendust' : 'Connect with Hendrik Puhkan'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'et'
                  ? 'Kavandatav töövestluse aeg, praktika või koostööpakkumine'
                  : 'Share proposed interview dates, role details, or opportunity note'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 mb-5">
              {language === 'et'
                ? '💡 Tehisintellekti assistendina ei lepi ma automaatselt kokku lepinguid ega kuupäevi. Palun jätke oma kontaktandmed, et Hendrik saaks teile otse vastata.'
                : '💡 As an AI voice assistant, I do not negotiate contracts or commit to dates on the spot. Please leave your details so Hendrik can confirm directly.'}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'et' ? 'Teie nimi *' : 'Your Name *'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Mart Tamm"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:outline-none text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'et' ? 'Ettevõte / Organisatsioon' : 'Company / Organization'}
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Bolt / Wise / Startup"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:outline-none text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'et' ? 'E-post *' : 'Email Address *'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:outline-none text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'et' ? 'Telefon' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+372 ..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:outline-none text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'et' ? 'Teema' : 'Topic'}
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:outline-none text-xs text-slate-900 dark:text-white"
                >
                  <option value="Interview Scheduling">
                    {language === 'et' ? 'Töövestluse aja kokkuleppimine' : 'Interview Scheduling'}
                  </option>
                  <option value="Internship Offer / Proposal">
                    {language === 'et' ? 'Praktika- või tööpakkumine' : 'Internship Offer / Proposal'}
                  </option>
                  <option value="BizDev & AI Automation Consulting">
                    {language === 'et' ? 'Äriarendus & AI automatiseerimine' : 'BizDev & AI Automation'}
                  </option>
                  <option value="General Networking / Coffee Chat">
                    {language === 'et' ? 'Tutvumine / Kohvikohtumine' : 'General Networking / Coffee Chat'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'et' ? 'Sõnum või soovitud ajad' : 'Message or Proposed Times'}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    language === 'et'
                      ? 'Kirjeldage rolli, soovitud vestluse aegu või küsimusi...'
                      : 'Provide proposed dates, role details, or questions for Hendrik...'
                  }
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:outline-none text-xs text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  {language === 'et' ? 'Loobu' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white shadow-xs transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? (language === 'et' ? 'Saadan...' : 'Sending...') : language === 'et' ? 'Saada Hendrikule' : 'Send to Hendrik'}</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
