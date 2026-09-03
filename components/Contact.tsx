import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, MapPin } from 'lucide-react';

const EMAIL = 'contact@acode.tech';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Nouveau projet — ${form.name || 'Contact site web'}`
    );
    const body = encodeURIComponent(
      `Nom : ${form.name}\nEmail : ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#030014]">
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-indigo-900/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-[#0B0C15] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Info Side */}
            <div className="p-10 md:p-14 bg-indigo-600 relative overflow-hidden flex flex-col justify-between">
              <div
                className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"
                aria-hidden="true"
              />
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Discutons de votre projet
                </h2>
                <p className="text-indigo-100 mb-10">
                  Prêt à transformer votre vision en réalité ? Notre équipe est
                  prête à relever le défi.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-white">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Mail className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="font-medium hover:underline"
                    >
                      {EMAIL}
                    </a>
                  </div>
                  <div className="flex items-center gap-4 text-white">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <MapPin className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="font-medium">
                      Casablanca, Maroc &amp; Remote Worldwide
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-10">
                <div className="text-sm text-indigo-200 font-medium tracking-widest uppercase mb-2">
                  ACode.tech
                </div>
                <div className="h-1 w-12 bg-white/50 rounded-full" />
              </div>
            </div>

            {/* Form Side */}
            <div className="p-10 md:p-14 bg-[#0B0C15]">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Nom Complet
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-[#151725] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-[#151725] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="vous@exemple.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium text-gray-400 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    value={form.message}
                    onChange={handleChange}
                    className="w-full bg-[#151725] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                    placeholder="Parlez-nous de vos besoins..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-[#030014] font-bold py-4 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 group"
                >
                  Envoyer le message
                  <ArrowRight
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </button>
                <p className="text-xs text-center text-gray-500 mt-4">
                  En envoyant ce formulaire, vous acceptez notre politique de
                  confidentialité.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
