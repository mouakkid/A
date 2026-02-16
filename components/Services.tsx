import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Globe, Shield, Code, Database, Rocket } from 'lucide-react';

const services = [
  {
    icon: Code,
    title: 'Apps Sur Mesure',
    description: "Développement de logiciels métiers spécifiques adaptés à vos processus complexes.",
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Smartphone,
    title: 'Mobile & PWA',
    description: "Expériences natives iOS/Android et Progressive Web Apps ultra-rapides.",
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Globe,
    title: 'E-commerce Avancé',
    description: "Plateformes de vente scalables, optimisées pour la conversion et l'international.",
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Shield,
    title: 'Cybersécurité',
    description: "Protection de vos données critiques, tests d'intrusion et conformité.",
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Rocket,
    title: 'SEO & Performance',
    description: "Stratégies techniques pour dominer les résultats de recherche.",
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    icon: Database,
    title: 'Big Data & IA',
    description: "Intégration d'intelligence artificielle et analyse de données pour la prise de décision.",
    gradient: 'from-indigo-500 to-purple-500',
  },
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display font-bold mb-6"
          >
            Solutions Digitales <span className="gradient-text">360°</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            De la conception à la maintenance, nous déployons les technologies les plus robustes pour votre croissance.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-1 rounded-3xl relative group"
            >
              {/* Gradient Border Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`} />
              
              <div className="bg-[#0b0c15]/90 h-full p-8 rounded-[22px] relative z-10 hover:bg-[#0b0c15]/50 transition-colors">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} p-0.5 mb-6`}>
                   <div className="w-full h-full bg-[#0b0c15] rounded-[14px] flex items-center justify-center">
                      <service.icon className="w-7 h-7 text-white" />
                   </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-white">
                  {service.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;