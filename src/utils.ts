import { DiaperSize, MimoType, RaffleNumber } from './types';

export const generateInitialNumbers = (): RaffleNumber[] => {
  const numbers: RaffleNumber[] = [];

  for (let i = 1; i <= 50; i++) {
    let fralda: DiaperSize = 'G';
    let mimo: string = 'Mimo';

    // Fralda P (1 a 10) - R$ 50
    if (i >= 1 && i <= 10) {
      fralda = 'P';
      if (i <= 5) mimo = 'Kit de pano de boca';
      else mimo = 'Kit de cueiro';
    } 
    // Fralda M (11 a 30) - R$ 60
    else if (i >= 11 && i <= 30) {
      fralda = 'M';
      if (i <= 20) mimo = 'Pacote de lenço umedecido';
      else if (i <= 25) mimo = 'Pomada de assadura';
      else mimo = 'Mimo';
    }
    // Fralda G (31 a 50) - R$ 70
    else {
      fralda = 'G';
      mimo = 'Fralda G';
    }

    numbers.push({
      numero: i,
      fralda,
      mimo,
      status: 'Livre',
    });
  }
  return numbers;
};
