import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, ShoppingBag, CreditCard, User, Phone, MapPin, Star, Heart } from 'lucide-react';
import { RaffleNumber, UserData } from '../types';
import { useState } from 'react';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: RaffleNumber[];
  onConfirm: (data: UserData) => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  whatsappUrl: string;
}

export const SummaryModal = ({ 
  isOpen, 
  onClose, 
  selectedItems, 
  onConfirm, 
  isSubmitting,
  isSuccess,
  whatsappUrl
}: SummaryModalProps) => {
  const [formData, setFormData] = useState<Omit<UserData, 'formaPagamento'>>({
    nome: '',
    telefone: '',
    endereco: '',
  });

  const totalValue = selectedItems.reduce((acc, item) => {
    if (item.fralda === 'P') return acc + 50;
    if (item.fralda === 'M') return acc + 60;
    return acc + 70;
  }, 0);

  const handleSubmit = (formaPagamento: UserData['formaPagamento']) => {
    if (!formData.nome || !formData.telefone || !formData.endereco) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    onConfirm({ ...formData, formaPagamento });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-brown-dark/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-brand-bg w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-brand-brown/10"
          >
            {/* Decorative background icons */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
               <Star className="absolute top-10 left-10" size={100} />
               <Heart className="absolute bottom-10 right-10" size={100} />
            </div>

            <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={onClose}
                className="p-3 hover:bg-brand-sage/10 rounded-full transition-colors text-brand-brown-dark bg-white/50 backdrop-blur-sm shadow-sm"
                aria-label="Fechar"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar relative z-10">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-10"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 text-green-600">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="font-serif text-3xl text-brand-brown-dark font-bold mb-3">Reserva Concluída!</h2>
                  <p className="text-brand-brown-dark/70 font-sans mb-10 leading-relaxed">
                    Sua reserva foi enviada com sucesso para a planilha. <br />
                    <strong>Agora, clique no botão abaixo para avisar no WhatsApp!</strong>
                  </p>
                  
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-sans font-bold py-5 rounded-2xl shadow-lg shadow-green-200 transition-all text-xl"
                  >
                    <Phone size={24} />
                    ABRIR WHATSAPP
                  </a>
                  
                  <button 
                    onClick={onClose}
                    className="mt-6 text-brand-brown-dark/40 font-sans text-sm hover:text-brand-brown-dark transition-colors"
                  >
                    Voltar para o início
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-sage/10 rounded-full mb-4 relative">
                      <ShoppingBag className="text-brand-sage" size={32} />
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-1 -right-1 text-brand-brown"
                      >
                        <Heart size={16} fill="currentColor" />
                      </motion.div>
                    </div>
                    <h2 className="font-serif text-2xl text-brand-brown-dark font-bold">Resumo da Escolha</h2>
                    <p className="text-brand-brown-dark/60 font-sans mt-1 italic">Tudo pronto para presentear o Iroh!</p>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3 mb-8">
                    {selectedItems.map((item) => (
                      <div key={item.numero} className="bg-white/80 p-4 rounded-2xl flex items-center justify-between border border-brand-brown/5 shadow-sm">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brand-sage/10 flex items-center justify-center font-serif font-bold text-brand-sage text-sm">
                              {item.numero}
                            </div>
                            <span className="text-brand-brown-dark font-sans font-medium">Fralda Tam. {item.fralda}</span>
                          </div>
                          <p className="text-xs text-brand-brown-dark/60 font-sans italic mt-1 ml-10">Mimo: {item.mimo}</p>
                        </div>
                        <CheckCircle2 className="text-brand-sage" size={20} />
                      </div>
                    ))}
                    <div className="pt-6 border-t border-brand-brown/10 flex justify-between items-center px-2">
                      <div className="flex flex-col">
                        <span className="text-brand-brown-dark/60 font-sans text-xs uppercase tracking-wider">Total do Sorteio</span>
                        <span className="text-brand-brown-dark font-sans font-bold">Contribuição PIX:</span>
                      </div>
                      <span className="text-brand-sage-dark font-serif text-2xl font-black italic">R$ {totalValue.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Registration Form */}
                  <div className="space-y-4 mb-8">
                    <h3 className="font-serif text-lg text-brand-brown-dark font-semibold border-b border-brand-brown/10 pb-2">Seus Dados</h3>
                    
                    <div className="space-y-3">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-brown/40" size={18} />
                        <input
                          type="text"
                          placeholder="Nome completo"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                          className="w-full bg-white border border-brand-brown/20 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all font-sans"
                        />
                      </div>
                      
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-brown/40" size={18} />
                        <input
                          type="tel"
                          placeholder="Telefone / WhatsApp"
                          value={formData.telefone}
                          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                          className="w-full bg-white border border-brand-brown/20 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all font-sans"
                        />
                      </div>
                      
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-brand-brown/40" size={18} />
                        <textarea
                          placeholder="Endereço (para entrega/contato)"
                          value={formData.endereco}
                          onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                          className="w-full bg-white border border-brand-brown/20 rounded-xl py-3 pl-10 pr-4 h-24 focus:outline-none focus:ring-2 focus:ring-brand-sage/30 focus:border-brand-sage transition-all font-sans resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      disabled={isSubmitting}
                      onClick={() => handleSubmit('Físico')}
                      className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-brand-brown/20 bg-white hover:bg-brand-brown/5 hover:border-brand-brown transition-all group disabled:opacity-50"
                    >
                      <ShoppingBag className="text-brand-brown mb-2 group-hover:scale-110 transition-transform" size={24} />
                      <span className="font-sans font-bold text-brand-brown-dark">Entrega Física</span>
                      <span className="text-[10px] text-brand-brown-dark/60 font-sans">Levo os itens pessoalmente</span>
                    </button>
                    
                    <button
                      disabled={isSubmitting}
                      onClick={() => handleSubmit('PIX')}
                      className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-brand-sage bg-brand-sage/10 hover:bg-brand-sage hover:text-white transition-all group disabled:opacity-50"
                    >
                      <CreditCard className="text-brand-sage mb-2 group-hover:scale-110 group-hover:text-white transition-all" size={24} />
                      <span className="font-sans font-bold text-brand-sage-dark group-hover:text-white transition-colors">Pagar via PIX</span>
                      <span className="text-[10px] text-brand-sage-dark/60 group-hover:text-white/80 font-sans transition-colors">Solicito chave via WhatsApp</span>
                    </button>
                  </div>
                  
                  {isSubmitting && (
                    <div className="mt-4 text-center">
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-brand-sage border-t-transparent mr-2" />
                      <span className="text-sm font-sans text-brand-brown-dark/60 italic">Processando sua reserva...</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
