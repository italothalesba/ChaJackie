import { motion } from 'motion/react';
import { Cloud, Star, Heart } from 'lucide-react';

export const Header = () => {
  return (
    <header className="text-center py-16 px-6 bg-brand-bg relative overflow-hidden">
      {/* Background Decorative Elements */}
      <motion.div 
        animate={{ y: [0, -10, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 text-brand-sage/20"
      >
        <Cloud size={80} fill="currentColor" />
      </motion.div>

      <motion.div 
        animate={{ y: [0, 15, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-20 right-10 text-brand-brown/20"
      >
        <Cloud size={100} fill="currentColor" />
      </motion.div>

      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-1/4 text-brand-brown/10"
      >
        <Star size={32} fill="currentColor" />
      </motion.div>

      <motion.div 
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 right-1/4 text-brand-sage/10"
      >
        <Heart size={24} fill="currentColor" />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-2xl mx-auto"
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white p-4 rounded-full shadow-lg border-4 border-brand-sage/20"
            >
              {/* Representação visual do ursinho com ícones já que a geração falhou */}
              <div className="w-20 h-20 bg-brand-brown/20 rounded-full flex items-center justify-center relative">
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-brand-brown/30 rounded-full" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-brand-brown/30 rounded-full" />
                <div className="w-12 h-10 bg-brand-brown/40 rounded-full flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-brand-brown-dark rounded-full mx-1" />
                   <div className="w-1.5 h-1.5 bg-brand-brown-dark rounded-full mx-1" />
                </div>
              </div>
            </motion.div>
            <motion.div 
              animate={{ x: [0, 5, 0], y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 text-brand-sage"
            >
              <Star fill="currentColor" size={24} />
            </motion.div>
          </div>
        </div>

        <h2 className="font-serif italic text-brand-brown-dark text-xl mb-2">Com carinho, para o</h2>
        <h1 className="font-serif text-5xl md:text-6xl text-brand-sage-dark font-bold mb-6 tracking-tight">
          Iroh Thales
        </h1>
        <p className="font-sans text-brand-brown-dark/80 text-lg mb-8 leading-relaxed">
          O nosso eterno <span className="text-brand-brown font-bold italic">Jackie Chan</span> está chegando!<br />
          Participe do nosso Chá Rifa e concorra a um <span className="bg-brand-sage/20 px-2 py-0.5 rounded text-brand-sage-dark font-bold">PIX de R$ 150,00</span>.
        </p>
        
        <div className="bg-white/40 backdrop-blur-md border-2 border-dashed border-brand-brown/30 rounded-3xl p-8 shadow-sm relative">
           <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-bg px-4 font-serif italic text-brand-brown-dark text-sm">
             Instruções da Rifa
           </div>
          <ul className="text-left font-sans text-brand-brown-dark/90 space-y-4">
            <li className="flex items-center gap-4">
              <div className="bg-brand-sage text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 shadow-sm">1</div>
              <span className="text-sm md:text-base">Escolha seus números da sorte (P: R$ 50 | M: R$ 60 | G: R$ 70).</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="bg-brand-brown text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 shadow-sm">2</div>
              <span className="text-sm md:text-base">Cada número vale um pacote de fralda + um presente especial.</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="bg-brand-sage-dark text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 shadow-sm">3</div>
              <span className="text-sm md:text-base">Confirme seus dados e escolha como prefere presentear.</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </header>
  );
};
