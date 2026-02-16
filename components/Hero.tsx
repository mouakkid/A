import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Layers, Cpu, Globe2, Mail } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <span className="relative px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium tracking-wide backdrop-blur-sm">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Innovation Digitale à Casablanca
              </span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.1] mb-8 tracking-tight"
          >
            Développement <br />
            <span className="gradient-text">Sur Mesure</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Agence experte en création d'<span className="text-white font-medium">applications mobiles (iOS/Android)</span> et sites web performants.
            Nous sécurisons votre avenir digital avec nos solutions en <span className="text-white font-medium">Cybersécurité</span>, <span className="text-white font-medium">FinTech</span> et <span className="text-white font-medium">Industrie 4.0</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="mailto:contact@acode.tech"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contacter l'Expert
              </span>
              <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#expertise"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Découvrir nos solutions
            </a>
          </motion.div>

          {/* Floating Elements (Visual Interest) */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-12 hidden lg:block opacity-20 pointer-events-none">
             <Layers className="w-24 h-24 text-indigo-500 rotate-12" />
          </div>
          <div className="absolute top-1/3 right-0 -translate-x-12 hidden lg:block opacity-20 pointer-events-none">
             <Cpu className="w-20 h-20 text-purple-500 -rotate-12" />
          </div>
          <div className="absolute bottom-20 left-1/4 hidden lg:block opacity-20 pointer-events-none">
             <Globe2 className="w-16 h-16 text-cyan-500 animate-bounce" style={{ animationDuration: '3s' }} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;