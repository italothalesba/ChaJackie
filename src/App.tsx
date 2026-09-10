/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RaffleGrid } from './components/RaffleGrid';
import { SummaryModal } from './components/SummaryModal';
import { RaffleNumber, UserData } from './types';
import { generateInitialNumbers } from './utils';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbxpFOaCxnqz2HBNHIHM4YqsM-zGnSvOPm5rTRpoOx2e1YYEZI5CA4b2oB0TR2rlf7A/exec';

export default function App() {
  const [numbers, setNumbers] = useState<RaffleNumber[]>(generateInitialNumbers());
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Sync with Google Sheets
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const envUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
    // Se a envUrl for vazia, for a URL padrão de exemplo ou for a URL antiga conhecida com erro, usamos a GAS_URL
    const isInvalidEnv = !envUrl || 
                        envUrl === 'SUA_URL_DO_GOOGLE_SCRIPT_AQUI' || 
                        envUrl.includes('AKfycbwOVwMhqicAVHNUhpJ27UoKi_zQvBPO2lnx8lZC-CpU6mlC04-A-uYoNJLXJVnSwf4aLw');
    
    const scriptUrl = isInvalidEnv ? GAS_URL : envUrl;
    
    // console.log('Tentando conectar com:', scriptUrl);
    
    if (!scriptUrl) {
      setSyncError('Configuração Pendente: O link da sua planilha não foi detectado.');
      setIsLoading(false);
      return;
    }

    try {
      setSyncError(null);
      
      const response = await fetch('/api/proxy');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro no Servidor: ${response.status}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        const updatedNumbers = generateInitialNumbers().map(localNum => {
          const remoteNum = data.find((d: any) => {
            const numPlanilha = d.Numero || d.numero || d.num || d['Número'] || d[Object.keys(d)[0]];
            return Number(numPlanilha) === localNum.numero;
          });

          if (remoteNum) {
            const statusRemote = remoteNum.Status || remoteNum.status || remoteNum.Situacao || remoteNum['Status'];
            const nomeRemote = remoteNum.Nome || remoteNum.nome || remoteNum['Nome'] || remoteNum['Dados do Convidado'];
            
            return {
              ...localNum,
              status: (statusRemote === 'Reservado' || statusRemote === 'Pago') ? 'Reservado' : 'Livre',
              nome: nomeRemote || ''
            };
          }
          return localNum;
        });
        setNumbers(updatedNumbers);
      }
    } catch (error: any) {
      console.warn('Erro na sincronização:', error);
      const envUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
      const isInvalidEnv = !envUrl || envUrl === 'SUA_URL_DO_GOOGLE_SCRIPT_AQUI';
      const activeUrl = isInvalidEnv ? GAS_URL : envUrl;
      
      setSyncError(`Falha na Conexão: O site não conseguiu conversar com o Google. Certifique-se de que o Script foi implantado como "Qualquer Pessoa". Detalhe: ${error.message || 'Erro de rede'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleNumber = (num: number) => {
    setSelectedNumbers(prev => 
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
    );
  };

  const handleConfirm = async (userData: UserData) => {
    setIsSubmitting(true);
    const envUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
    const isInvalidEnv = !envUrl || 
                        envUrl === 'SUA_URL_DO_GOOGLE_SCRIPT_AQUI' || 
                        envUrl.includes('AKfycbwOVwMhqicAVHNUhpJ27UoKi_zQvBPO2lnx8lZC-CpU6mlC04-A-uYoNJLXJVnSwf4aLw');
    
    const scriptUrl = isInvalidEnv ? GAS_URL : envUrl;

    const chosenItems = numbers.filter(n => selectedNumbers.includes(n.numero));
    const totalValue = chosenItems.reduce((acc, item) => {
      if (item.fralda === 'P') return acc + 50;
      if (item.fralda === 'M') return acc + 60;
      return acc + 70;
    }, 0);

    // Payload for Google Sheets - Organized to match script expectations
    const payload = {
      action: 'reserve',
      detalhes: chosenItems.map(item => ({
        Numero: item.numero,
        Fralda: `Fralda ${item.fralda}`,
        Mimo: item.mimo,
        Nome: userData.nome,
        Telefone: userData.telefone,
        Endereco: userData.endereco,
        Forma_Pagamento: userData.formaPagamento
      }))
    };

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || (result.raw && result.raw.includes('Erro'))) {
        throw new Error(result.details || result.raw || 'A planilha recusou a reserva.');
      }

      // Construct WhatsApp message
      const itemsList = chosenItems.map(item => `• Nº ${item.numero} (Fralda ${item.fralda} + ${item.mimo})`).join('\n');
      const paymentMsg = userData.formaPagamento === 'PIX' 
        ? `Total: R$ ${totalValue.toFixed(2)}\nFavor enviar a chave PIX!`
        : `Vou entregar os itens pessoalmente!`;

      const message = `Olá! Estou reservando os números para o Chá Rifa do Iroh Thales!\n\n` +
        `Dados:\n` +
        `Nome: ${userData.nome}\n` +
        `Endereço: ${userData.endereco}\n` +
        `Pagamento: ${userData.formaPagamento}\n\n` +
        `Escolhas:\n${itemsList}\n\n` +
        `${paymentMsg}`;

      // Open WhatsApp
      const whatsappNumber = '5588981112005';
      const encodedMessage = encodeURIComponent(message);
      const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      setWhatsappUrl(url);
      setIsSuccess(true);
      
      // ONLY update local state if server confirmed
      setNumbers(prev => prev.map(n => 
        selectedNumbers.includes(n.numero) ? { ...n, status: 'Reservado', nome: userData.nome } : n
      ));
      setSelectedNumbers([]);
    } catch (error: any) {
      console.error('Erro ao enviar reserva:', error);
      alert(`Erro na Planilha: ${error.message}\n\nVerifique se o Script do Google está implantado corretamente como "Qualquer pessoa".`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenScript = () => {
    const envUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
    const scriptUrl = (!envUrl || envUrl === 'SUA_URL_DO_GOOGLE_SCRIPT_AQUI') ? GAS_URL : envUrl;
    if (scriptUrl) window.open(scriptUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-brand-bg pb-20">
      <Header />
      
      {syncError && (
        <div className="max-w-4xl mx-auto px-4 mb-4">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 flex items-start gap-4 text-amber-800 shadow-sm relative overflow-hidden">
            <div className="bg-amber-100 p-2 rounded-xl flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <div className="relative z-10 pr-8">
              <p className="font-bold text-base mb-1">Aviso</p>
              <p className="opacity-90 leading-relaxed text-sm">
                Estamos com uma instabilidade momentânea na conexão. Por favor, tente recarregar a página ou tente novamente em alguns instantes.
              </p>
              <div className="mt-4">
                <button 
                  onClick={() => fetchData()}
                  className="bg-amber-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-amber-950 transition-colors shadow-lg shadow-amber-900/20"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-sage border-t-transparent mb-4" />
          <p className="font-serif text-brand-brown-dark italic">Preparando a cartela do Iroh...</p>
        </div>
      ) : (
        <RaffleGrid 
          numbers={numbers} 
          selectedNumbers={selectedNumbers} 
          onToggleNumber={handleToggleNumber} 
        />
      )}

      {/* Floating Action Button */}
      {selectedNumbers.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-6 z-40 flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full max-w-sm bg-brand-sage hover:bg-brand-sage-dark text-white font-serif text-xl font-bold py-4 rounded-2xl shadow-xl shadow-brand-sage/30 transition-all flex items-center justify-center gap-3 animate-bounce"
          >
            Confirmar {selectedNumbers.length} {selectedNumbers.length === 1 ? 'Número' : 'Números'}
          </button>
        </div>
      )}

      <SummaryModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsSuccess(false);
        }}
        selectedItems={numbers.filter(n => selectedNumbers.includes(n.numero))}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
        whatsappUrl={whatsappUrl}
      />

      <footer className="text-center py-12 px-6 text-brand-brown-dark/40 font-sans text-xs">
        <p>© 2026 Chá Rifa do Iroh Thales • Feito com carinho</p>
      </footer>
    </div>
  );
}

