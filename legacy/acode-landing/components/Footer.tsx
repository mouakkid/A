import React from 'react';
import { Code2, Twitter, Linkedin, Github, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#02000d] border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <a href="#" className="flex items-center gap-2 mb-6 group w-fit">
              <Code2 className="w-6 h-6 text-indigo-500 group-hover:text-indigo-400 transition-colors" />
              <span className="font-display font-bold text-2xl tracking-tighter text-white">
                ACode<span className="text-indigo-500">.tech</span>
              </span>
            </a>
            <p className="text-gray-400 max-w-sm mb-6">
              Expertise digitale à Casablanca. Développement Mobile, Web & Cybersécurité pour propulser votre entreprise vers de nouveaux sommets.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-white/5 rounded-full hover:bg-indigo-500 hover:text-white transition-all text-gray-400">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links (Anchors) */}
          <div>
            <h4 className="text-white font-bold mb-6">Navigation</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Accueil</a></li>
              <li><a href="#services" className="hover:text-indigo-400 transition-colors">Nos Services</a></li>
              <li><a href="#about" className="hover:text-indigo-400 transition-colors">À Propos</a></li>
              <li><a href="#contact" className="hover:text-indigo-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3">
                 <Mail className="w-5 h-5 text-indigo-500 shrink-0" />
                 <a href="mailto:contact@acode.tech" className="hover:text-white transition-colors break-all">contact@acode.tech</a>
              </li>
              <li className="flex items-center gap-3">
                 <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
                 <span>Casablanca, Maroc</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ACode.tech. Tous droits réservés.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-2">
            Fait avec passion au Maroc <span role="img" aria-label="drapeau maroc">🇲🇦</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;