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
  const [stock, setStock] = useState<Record<AnimalType, number>>();

  const fetchState = async () => {
    try {
      const res = await fetch('http://localhost:5228/Game/state');
      const data = await res.json();
      const players: Record<string, Record<AnimalType, number>> = {};
      (data.players as PlayerData[]).forEach((p) => {
        players[p.name] = p.animals;
      });
      setState({ currentPlayer: data.currentPlayer, players });
    } catch {
      setState(null);
    }
  };

  const fetchStock = async () => {
    const res = await fetch('http://localhost:5228/Game/stock');
    const data = await res.json();
    setStock(data);
  };

  const rollDice = async () => {
    const res = await fetch('http://localhost:5228/Game/roll', { method: 'POST' });
    const data = await res.json();
    setDice(data.dice);
    setWinner(data.winner);
    setChanges(data.changes);
    setLastRollPlayer(data.player);
    await fetchState();
    await fetchStock();
  };

  const exchange = async () => {
    const res = await fetch(
      `http://localhost:5228/Game/exchange?from=${fromAnimal}&to=${toAnimal}&amount=${amount}`,
      { method: 'POST' }
    );
    if (res.ok) {
      await fetchState();
      await fetchStock();
    } else alert('Wymiana nieudana.');
  };

  const restart = async () => {
    await fetch('http://localhost:5228/Game/restart', { method: 'POST' });
    await fetchState();
    await fetchStock();
  };

  useEffect(() => {
    fetchState();
    fetchStock();
  }, []);

  const isExchangeValid = () => {
    if (!state || !stock) return false;
    const player = state.players[state.currentPlayer];
    const rates: Record<string, number> = {
      'Królik_Owca': 6,
      'Owca_Świnia': 2,
      'Świnia_Krowa': 3,
      'Krowa_Koń': 2,
      'Owca_Królik': 1,
      'Świnia_Owca': 2,
      'Krowa_Świnia': 3,
      'Koń_Krowa': 2
    };
    const key = `${fromAnimal}_${toAnimal}`;
    const required = rates[key] * amount;
    return rates[key] && player[fromAnimal] >= required && stock[toAnimal] >= amount;
  };

  return (
    <div className="app-container" style={{ color: 'orange' }}>
      <h1>Super Farmer</h1>

      <button onClick={restart} className="button">Nowa gra</button>

      {!state ? <h3>Ładowanie gry...</h3> : (
        <>
          <h2>Tura: {state.currentPlayer}</h2>
          <button onClick={rollDice} className="button">
            Rzut
          </button>

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

          <h2>Główne stado:</h2>
          {stock && (
            <ul>
              {Object.entries(stock)
                .filter(([a]) => a in animalIcons)
                .map(([a, count]) => {
                  const key = a as AnimalType;
                  return (
                    <li key={a}>
                      {animalIcons[key]} {key}: {count}
                    </li>
                  );
                })}
            </ul>
          )}

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
              <button onClick={exchange} className="button" disabled={!isExchangeValid()}>
              Wymień
            </button>
            </div>
          </div>

          {winner && <div className="winner">{winner} wygrywa!</div>}
        </>
      )}
    </div>
  );
}

export default App;
