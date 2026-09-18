import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Mail } from 'lucide-react';

const About: React.FC = () => {
  const benefits = [
    "Expertise Technique Avancée",
    "Design Centré Utilisateur (UI/UX)",
    "Sécurité 'Security-First'",
    "Support et Maintenance 24/7",
    "Stratégies SEO Performantes",
    "Délais Respectés"
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#050511]">
        {/* Abstract shape */}
        <div className="absolute right-0 top-1/4 w-1/2 h-1/2 bg-indigo-900/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-8 leading-tight">
              Pourquoi choisir <br/>
              <span className="gradient-text">ACode.tech ?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Dans un monde numérique en constante évolution, vous avez besoin d'un partenaire qui ne se contente pas de suivre les tendances, mais qui les crée. Chez ACode, nous combinons ingénierie logicielle rigoureuse et créativité sans limites.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {benefits.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                  <span className="text-gray-300 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <a 
              href="mailto:contact@acode.tech"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white font-medium hover:bg-white/10 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Envoyer un email directement
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative"
          >
             {/* Image Container with Style */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-indigo-600/20 mix-blend-overlay z-10"></div>
                <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070" 
                    alt="Equipe ACode Tech" 
                    className="w-full h-auto object-cover"
                />
                
                {/* Floating Stats */}
                <div className="absolute bottom-6 left-6 right-6 z-20 grid grid-cols-2 gap-4">
                     <div className="bg-[#030014]/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
                        <div className="text-3xl font-bold text-white">50+</div>
                        <div className="text-xs text-indigo-300 uppercase tracking-wide">Projets Réussis</div>
                     </div>
                     <div className="bg-[#030014]/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
                        <div className="text-3xl font-bold text-white">100%</div>
                        <div className="text-xs text-indigo-300 uppercase tracking-wide">Engagement</div>
                     </div>
                </div>
            </div>

            {/* Decoration Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;