export type DiaperSize = 'P' | 'M' | 'G';

export type MimoType = string;

export interface RaffleNumber {
  numero: number;
  fralda: DiaperSize;
  mimo: MimoType;
  status: 'Livre' | 'Reservado';
  nome?: string;
}

export interface UserData {
  nome: string;
  telefone: string;
  endereco: string;
  formaPagamento: 'Físico' | 'PIX';
}
