import { motion } from 'motion/react';
import { RaffleNumber } from '../types';
import { Star } from 'lucide-react';

interface RaffleGridProps {
  numbers: RaffleNumber[];
  selectedNumbers: number[];
  onToggleNumber: (num: number) => void;
}

export const RaffleGrid = ({ numbers, selectedNumbers, onToggleNumber }: RaffleGridProps) => {
  return (
    <section className="py-12 px-4 max-w-4xl mx-auto relative">
      {/* Decorative stars behind grid */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <Star className="absolute top-10 left-[5%] text-brand-sage/10 animate-pulse" size={40} fill="currentColor" />
        <Star className="absolute bottom-20 right-[5%] text-brand-brown/10 animate-bounce" size={30} fill="currentColor" />
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-4">
        {numbers.map((item) => {
          const isSelected = selectedNumbers.includes(item.numero);
          const isReserved = item.status === 'Reservado';
          
          return (
            <motion.button
              key={item.numero}
              whileHover={!isReserved ? { scale: 1.1, rotate: [0, -2, 2, 0] } : {}}
              whileTap={!isReserved ? { scale: 0.9 } : {}}
              onClick={() => !isReserved && onToggleNumber(item.numero)}
              disabled={isReserved}
              className={`
                aspect-square w-full rounded-2xl font-serif text-xl font-bold transition-all duration-300 flex items-center justify-center relative shadow-sm
                ${isReserved 
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed border-2 border-transparent' 
                  : isSelected 
                    ? 'bg-brand-sage text-white border-b-4 border-brand-sage-dark shadow-md scale-105' 
                    : 'bg-white text-brand-brown-dark border-2 border-brand-brown/10 hover:border-brand-sage/30 hover:bg-brand-bg'
                }
              `}
            >
              <span className="relative z-10">{item.numero}</span>
              {isSelected && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1"
                >
                  <Star size={14} className="text-brand-brown-dark fill-brand-brown" />
                </motion.div>
              )}
              {isReserved && (
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <Star size={24} fill="currentColor" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      
      <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm font-sans text-brand-brown-dark/70 bg-white/30 backdrop-blur-sm p-4 rounded-2xl border border-brand-brown/5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white border-2 border-brand-brown/10 rounded-lg shadow-sm" />
          <span className="font-medium">Livre</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-brand-sage border-b-2 border-brand-sage-dark rounded-lg shadow-sm" />
          <span className="font-medium">Sua Escolha</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-100 rounded-lg shadow-sm flex items-center justify-center">
             <Star size={10} className="text-gray-300" fill="currentColor" />
          </div>
          <span className="font-medium">Já Reservado</span>
        </div>
      </div>
    </section>
  );
};
