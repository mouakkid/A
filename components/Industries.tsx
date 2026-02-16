import React from 'react';
import { motion } from 'framer-motion';
import { Factory, ShoppingCart, Landmark, ArrowUpRight } from 'lucide-react';

const Industries: React.FC = () => {
  const industries = [
    {
      id: "industrie",
      title: "Industrie & Logistique",
      icon: Factory,
      description: "Transformation digitale des usines (Industrie 4.0), gestion IoT, optimisation de la chaîne logistique et ERP sur mesure.",
      tags: ["IoT", "ERP", "Traçabilité"],
      // Image: High-tech automated warehouse or factory
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070"
    },
    {
      id: "finance",
      title: "Finance & Fintech",
      icon: Landmark,
      description: "Solutions bancaires sécurisées, plateformes de paiement, blockchain et tableaux de bord analytiques complexes.",
      tags: ["Sécurité", "Blockchain", "Analytics"],
      // Image: Digital finance analytics
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070"
    },
    {
      id: "ecommerce",
      title: "Retail & E-commerce",
      icon: ShoppingCart,
      description: "Expériences d'achat omnicanales, marketplaces performantes et intégrations CRM/PIM avancées.",
      tags: ["Marketplace", "UX/UI", "Conversion"],
      // Image: Elegant modern retail store / fashion
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070"
    }
  ];

  return (
    <section id="expertise" className="py-24 relative bg-[#02020a]">
      {/* Decorative background line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-900 to-transparent" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
                <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-indigo-500 font-semibold tracking-wider uppercase text-sm mb-2 block"
                >
                    Expertise Métier
                </motion.span>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-display font-bold"
                >
                    Nous parlons votre <br/><span className="text-white">Langage Métier</span>
                </motion.h2>
            </div>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 max-w-sm text-right hidden md:block"
            >
                Une compréhension approfondie de vos enjeux sectoriels pour des solutions technologiques pertinentes.
            </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {industries.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="group relative h-[450px] rounded-3xl overflow-hidden cursor-pointer shadow-xl border border-white/5"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#02020a] via-[#02020a]/80 to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <div className="mb-auto opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                             <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg shadow-indigo-600/30">
                                <item.icon />
                             </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                            {item.title}
                            <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-400" />
                        </h3>
                        
                        <p className="text-gray-300 mb-6 line-clamp-2 group-hover:line-clamp-none transition-all">
                            {item.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {item.tags.map(tag => (
                                <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white border border-white/5 backdrop-blur-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;