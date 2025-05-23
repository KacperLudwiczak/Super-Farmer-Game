import type { AnimalType } from "../Interfaces/Interfaces";
import { animalIcons } from "../Interfaces/Interfaces";

interface Props {
  playerName: string;
  animals: Record<AnimalType, number>;
  changes: Record<string, number>;
  isActive: boolean;
}

export default function PlayerBoard({ playerName, animals, changes, isActive }: Props) {
  return (
    <div className="player-board">
      <h3>{playerName}</h3>
      <ul>
        {Object.entries(animals).map(([animal, count]) => {
          const diff = isActive ? (changes[animal] || 0) : 0;
          return (
            <li key={animal} className={diff > 0 ? 'gain' : diff < 0 ? 'loss' : ''}>
              {animalIcons[animal as AnimalType]} {animal} {count}{' '}
              {diff !== 0 && <span>({diff > 0 ? '+' : ''}{diff})</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
