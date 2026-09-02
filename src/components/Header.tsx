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
           <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-bg px-4 font-serif italic text-brand-brown-dark text-sm whitespace-nowrap">
             Escolha seu Presente (1 a 50)
           </div>
          
          <div className="mb-6 text-center">
            <p className="text-sm font-sans text-brand-brown-dark/80 leading-relaxed">
              Você pode escolher trazer o <strong>presente físico</strong> ou contribuir com o <strong>valor sugerido via PIX</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-brand-sage-dark border-b border-brand-sage/20 pb-1">Sugestão P - R$ 50</h3>
              <ul className="text-xs space-y-2 font-sans text-brand-brown-dark/80">
                <li className="flex gap-2"><strong>01 ao 05:</strong> Fralda P + Kit de pano de boca</li>
                <li className="flex gap-2"><strong>06 ao 10:</strong> Fralda P + Kit de cueiro</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif font-bold text-brand-sage-dark border-b border-brand-sage/20 pb-1">Sugestão M - R$ 60</h3>
              <ul className="text-xs space-y-2 font-sans text-brand-brown-dark/80">
                <li className="flex gap-2"><strong>11 ao 20:</strong> Fralda M + Lenço umedecido</li>
                <li className="flex gap-2"><strong>21 ao 25:</strong> Fralda M + Pomada</li>
                <li className="flex gap-2"><strong>26 ao 30:</strong> Fralda M + Mimo</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif font-bold text-brand-sage-dark border-b border-brand-sage/20 pb-1">Sugestão G - R$ 70</h3>
              <ul className="text-xs space-y-2 font-sans text-brand-brown-dark/80">
                <li className="flex gap-2"><strong>31 ao 50:</strong> Fralda G</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-brand-brown/10 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-brand-sage-dark font-bold text-sm">
              <Star size={16} fill="currentColor" />
              <span>Sorteio de R$ 150,00 via PIX!</span>
              <Star size={16} fill="currentColor" />
            </div>
            
            <div className="flex flex-col items-center gap-1 font-sans text-brand-brown-dark/90">
              <p className="text-sm font-bold bg-brand-sage/10 px-3 py-1 rounded-full">
                📅 Data: 10/10 no Instagram <a href="https://instagram.com/_dandharas.m" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-sage-dark transition-colors">@_dandharas.m</a>
              </p>
              <p className="text-[10px] italic text-brand-brown-dark/60">
                O resultado será divulgado aqui na plataforma no dia do sorteio.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  );
};
