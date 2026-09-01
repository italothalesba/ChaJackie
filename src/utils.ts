import { DiaperSize, MimoType, RaffleNumber } from './types';

export const generateInitialNumbers = (): RaffleNumber[] => {
  const numbers: RaffleNumber[] = [];

  for (let i = 1; i <= 50; i++) {
    let fralda: DiaperSize = 'G';
    let mimo: string = 'Mimo';

    // Fralda P (1 a 15)
    if (i >= 1 && i <= 15) {
      fralda = 'P';
      if (i <= 6) mimo = 'Kit de pano de boca';
      else if (i <= 10) mimo = 'Kit de cueiro (3 un.)';
      else if (i <= 12) mimo = 'Pacote algodão';
      else mimo = 'Mimo';
    } 
    // Fralda M (16 a 35)
    else if (i >= 16 && i <= 35) {
      fralda = 'M';
      if (i <= 23) mimo = 'Pacote de lenço umedecido';
      else if (i <= 26) mimo = '1 Pomada de assadura';
      else mimo = 'Mimo';
    }
    // Fralda G (36 a 50)
    else {
      fralda = 'G';
      mimo = 'Mimo';
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
