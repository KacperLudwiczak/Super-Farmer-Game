import { useEffect, useState } from 'react';
import './App.css';

type AnimalType = 'Królik' | 'Owca' | 'Świnia' | 'Krowa' | 'Koń' | 'MałyPies' | 'DużyPies';

interface GameState {
  currentPlayer: string;
  players: Record<string, Record<AnimalType, number>>;
}

interface PlayerData {
  name: string;
  animals: Record<AnimalType, number>;
}

interface RollResult {
  dice: string[];
  player: string;
  changes: Record<AnimalType, number>;
  winner: string | null;
}

const animalIcons: Record<AnimalType, string> = {
  Królik: '🐇',
  Owca: '🐑',
  Świnia: '🐖',
  Krowa: '🐄',
  Koń: '🐎',
  MałyPies: '🐕',
  DużyPies: '🐶'
};

function App() {
  const [state, setState] = useState<GameState | null>(null);
  const [dice, setDice] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [changes, setChanges] = useState<Record<string, number>>({});
  const [lastRollPlayer, setLastRollPlayer] = useState<string | null>(null);

  const [fromAnimal, setFromAnimal] = useState<AnimalType>('Królik');
  const [toAnimal, setToAnimal] = useState<AnimalType>('Owca');
  const [amount, setAmount] = useState<number>(1);

  const fetchState = async () => {
    try {
      const res = await fetch('http://localhost:5228/Game/state');
      const data = await res.json();
      console.log('Fetched state:', data);

      if (!data.currentPlayer || !Array.isArray(data.players)) {
        console.error('Niepoprawna odpowiedź z backendu:', data);
        return;
      }

      const players: Record<string, Record<AnimalType, number>> = {};
      (data.players as PlayerData[]).forEach((p) => {
        players[p.name] = p.animals;
      });

      setState({ currentPlayer: data.currentPlayer, players });
    } catch (err) {
      console.error('Błąd ładowania stanu:', err);
      setState(null);
    }
  };

  const rollDice = async () => {
    try {
      const res = await fetch('http://localhost:5228/Game/roll', { method: 'POST' });
      const data: RollResult = await res.json();
      setDice(data.dice);
      setWinner(data.winner);
      setChanges(data.changes);
      setLastRollPlayer(data.player);
      await fetchState();
    } catch (err) {
      console.error('Błąd rzutu kostką:', err);
    }
  };

  const exchange = async () => {
    try {
      const res = await fetch(`http://localhost:5228/Game/exchange?from=${fromAnimal}&to=${toAnimal}&amount=${amount}`, {
        method: 'POST'
      });
      if (res.ok) {
        await fetchState();
      } else {
        alert('Wymiana nieudana.');
      }
    } catch (err) {
      console.error('Błąd wymiany:', err);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  return (
    <div className="app-container" style={{ color: 'orange' }}>
      <h1>Super Farmer</h1>

      {!state ? (
        <h3>Ładowanie gry...</h3>
      ) : (
        <>
          <h2>Tura: {state.currentPlayer}</h2>
          <button onClick={rollDice} className="button">
            Rzut
          </button>

          <div className="exchange-form">
            <h2>Wymiana</h2>
            <div className="form-group">
              <label>
                Z:
                <select value={fromAnimal} onChange={(e) => setFromAnimal(e.target.value as AnimalType)}>
                  {Object.keys(animalIcons).map((animal) => (
                    <option key={animal} value={animal}>
                      {animalIcons[animal as AnimalType]} {animal}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Na:
                <select value={toAnimal} onChange={(e) => setToAnimal(e.target.value as AnimalType)}>
                  {Object.keys(animalIcons).map((animal) => (
                    <option key={animal} value={animal}>
                      {animalIcons[animal as AnimalType]} {animal}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Ilość:
                <input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                />
              </label>
              <button onClick={exchange} className="button">
                Wymień
              </button>
            </div>
          </div>

          <h2 className="dice">Kostki: {dice.join(', ')}</h2>

          <div className="players">
            {Object.entries(state.players).map(([playerName, animals]) => {
              const isActive = playerName === lastRollPlayer;
              return (
                <div key={playerName} className="player-board">
                  <h3>{playerName}</h3>
                  <ul>
                    {Object.entries(animals).map(([animal, count]) => {
                      const diff = isActive ? (changes[animal] || 0) : 0;
                      return (
                        <li key={animal} className={diff > 0 ? 'gain' : diff < 0 ? 'loss' : ''}>
                          {animalIcons[animal as AnimalType]} {animal}: {count}{' '}
                          {diff !== 0 && <span>({diff > 0 ? '+' : ''}{diff})</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {winner && <div className="winner">{winner} wygrywa!</div>}
        </>
      )}
    </div>
  );
}

export default App;
