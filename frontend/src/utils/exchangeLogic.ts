import type { AnimalType } from "../Interfaces/Interfaces";

export const exchangeRates: Record<string, number> = {
  'Królik_Owca': 6,
  'Owca_Świnia': 2,
  'Świnia_Krowa': 3,
  'Krowa_Koń': 2,
  'Owca_Królik': 1,
  'Świnia_Owca': 2,
  'Krowa_Świnia': 3,
  'Koń_Krowa': 2
};

export function isExchangeValid(
  player: Record<AnimalType, number>,
  stock: Record<AnimalType, number>,
  from: AnimalType,
  to: AnimalType,
  amount: number,
  hasExchanged: boolean
): boolean {
  if (hasExchanged) return false;
  const key = `${from}_${to}`;
  const rate = exchangeRates[key];
  return !!rate && player[from] >= rate * amount && stock[to] >= amount;
}

export function getExchangeError(
  player: Record<AnimalType, number>,
  stock: Record<AnimalType, number>,
  from: AnimalType,
  to: AnimalType,
  amount: number,
  hasExchanged: boolean
): string | null {
  if (hasExchanged) return 'Już wymieniałeś w tej turze.';
  const key = `${from}_${to}`;
  const rate = exchangeRates[key];
  if (!rate) return 'Nieprawidłowy kurs wymiany.';
  const required = rate * amount;
  if (player[from] < required) return `Potrzebujesz ${required} ${from}, ale masz tylko ${player[from]}.`;
  if (stock[to] < amount) return `Brakuje ${to} w głównym stadzie.`;
  return null;
}
