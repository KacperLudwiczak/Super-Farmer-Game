export type AnimalType = 'Królik' | 'Owca' | 'Świnia' | 'Krowa' | 'Koń' | 'MałyPies' | 'DużyPies';

export interface GameState {
  currentPlayer: string;
  players: Record<string, Record<AnimalType, number>>;
}

export interface PlayerData {
  name: string;
  animals: Record<AnimalType, number>;
}

export const animalIcons: Record<AnimalType, string> = {
  Królik: '🐇',
  Owca: '🐑',
  Świnia: '🐖',
  Krowa: '🐄',
  Koń: '🐎',
  MałyPies: '🐕',
  DużyPies: '🐶'
};