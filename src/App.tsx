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
      await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Construct WhatsApp message
      const itemsList = chosenItems.map(item => `• Nº ${item.numero} (Fralda ${item.fralda} + ${item.mimo})`).join('\n');
      const paymentMsg = userData.formaPagamento === 'PIX' 
        ? `Total: R$ ${totalValue.toFixed(2)}\nFavor enviar a chave PIX!`
        : `Vou entregar os itens pessoalmente!`;

      const message = `Ola! Estou reservando os numeros para o Cha Rifa do Iroh Thales!\n\n` +
        `Dados:\n` +
        `Nome: ${userData.nome}\n` +
        `Endereco: ${userData.endereco}\n` +
        `Pagamento: ${userData.formaPagamento}\n\n` +
        `Escolhas:\n${itemsList}\n\n` +
        `${paymentMsg}`;

      // Open WhatsApp - Using wa.me with window.open in a new tab
      const whatsappNumber = '5588981112005';
      const encodedMessage = encodeURIComponent(message);
      const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      setWhatsappUrl(url);
      setIsSuccess(true);
      
      // Update local state and clear selection
      setNumbers(prev => prev.map(n => 
        selectedNumbers.includes(n.numero) ? { ...n, status: 'Reservado', nome: userData.nome } : n
      ));
      setSelectedNumbers([]);
    } catch (error) {
      console.error('Erro ao enviar reserva:', error);
      alert('Houve um erro ao processar sua reserva. Tente novamente ou entre em contato via WhatsApp.');
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
              <button 
                onClick={() => setSyncError(null)}
                className="absolute -top-1 -right-1 p-1.5 hover:bg-amber-100 rounded-lg transition-colors text-amber-900/40 hover:text-amber-900"
                title="Fechar aviso"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
              <p className="font-bold text-base mb-1">Problema de Sincronização</p>
              <p className="opacity-90 leading-relaxed text-sm">
                {syncError}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button 
                  onClick={() => fetchData()}
                  className="bg-amber-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-950 transition-colors"
                >
                  Tentar Reconectar
                </button>
                <button 
                  onClick={handleOpenScript}
                  className="bg-white border border-amber-200 text-amber-900 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors"
                >
                  Testar Link da Planilha
                </button>
                <a 
                  href="#" 
                  className="text-amber-900 text-xs font-bold hover:underline flex items-center gap-1 pt-1.5"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Siga estes passos EXATAMENTE:\n\n1. No Google Sheets: Extensões > Apps Script\n2. Clique em Implantar > Gerenciar Implantações\n3. Clique no Lápis (Editar)\n4. Mude "Quem tem acesso" para "Qualquer Pessoa" (Anyone)\n5. MUITO IMPORTANTE: Em "Configuração", selecione "Nova Versão"\n6. Clique em Implantar\n7. Copie a nova URL e use-a no seu arquivo .env');
                  }}
                >
                  Ver Passo-a-passo →
                </a>
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
        <p>© 2026 Chá Rifa Iroh Thales • v3.9 (Robust Proxy)</p>
      </footer>
    </div>
  );
}

