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

export default function App() {
  const [numbers, setNumbers] = useState<RaffleNumber[]>(generateInitialNumbers());
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync with Google Sheets
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
      console.warn('VITE_GOOGLE_SCRIPT_URL não configurada. Usando dados locais.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Tentando conectar à planilha...');
      const response = await fetch(scriptUrl, {
        method: 'GET',
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        const updatedNumbers = generateInitialNumbers().map(localNum => {
          const remoteNum = data.find(d => {
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
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      // Mostramos um alerta discreto no console e mantemos os dados locais
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
    const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

    const chosenItems = numbers.filter(n => selectedNumbers.includes(n.numero));
    const totalValue = selectedNumbers.length * 50;

    // Payload for Google Sheets
    const payload = {
      action: 'reserve',
      numeros: selectedNumbers,
      ...userData
    };

    try {
      if (scriptUrl) {
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors', // Common for Google Apps Script
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      // Construct WhatsApp message
      const itemsList = chosenItems.map(item => `• Nº ${item.numero} (Fralda ${item.fralda} + ${item.mimo})`).join('\n');
      const paymentMsg = userData.formaPagamento === 'PIX' 
        ? `*Total:* R$ ${totalValue.toFixed(2)}\nFavor enviar a chave PIX!`
        : `Vou entregar os itens pessoalmente!`;

      const message = encodeURIComponent(
        `Olá! Estou reservando os números para o Chá Rifa do *Iroh Thales*!\n\n` +
        `*Dados:*\n` +
        `👤 Nome: ${userData.nome}\n` +
        `📍 Endereço: ${userData.endereco}\n` +
        `💳 Pagamento: ${userData.formaPagamento}\n\n` +
        `*Escolhas:*\n${itemsList}\n\n` +
        `${paymentMsg}`
      );

      // Open WhatsApp
      const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5585999999999';
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
      
      // Update local state and clear selection
      setNumbers(prev => prev.map(n => 
        selectedNumbers.includes(n.numero) ? { ...n, status: 'Reservado', nome: userData.nome } : n
      ));
      setSelectedNumbers([]);
      setIsModalOpen(false);
      
      alert('Reserva enviada com sucesso! Você será redirecionado para o WhatsApp.');

    } catch (error) {
      console.error('Erro ao enviar reserva:', error);
      alert('Houve um erro ao processar sua reserva. Tente novamente ou entre em contato via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg pb-20">
      <Header />
      
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
        onClose={() => setIsModalOpen(false)}
        selectedItems={numbers.filter(n => selectedNumbers.includes(n.numero))}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
      />

      <footer className="text-center py-12 px-6 text-brand-brown-dark/40 font-sans text-xs">
        <p>© 2026 Chá Rifa Iroh Thales • Feito com amor por amigos e família</p>
      </footer>
    </div>
  );
}

