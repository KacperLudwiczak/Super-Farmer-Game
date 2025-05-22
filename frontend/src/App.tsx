import { useEffect, useState } from 'react';
import './App.css';
import Roles from './Roles';
import { animalIcons, type AnimalType, type GameState, type PlayerData } from './Interfaces/Interfaces';
import ExchangePanel from './components/ExchangePanel';
import PlayerBoard from './components/PlayerBoard';
import { isExchangeValid, getExchangeError } from './utils/exchangeLogic';

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
  const [showRules, setShowRules] = useState(false);
  const [hasExchanged, setHasExchanged] = useState(false);

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
    setHasExchanged(false);
    await fetchState();
    await fetchStock();
  };

  const exchange = async () => {
    const res = await fetch(
      `http://localhost:5228/Game/exchange?from=${fromAnimal}&to=${toAnimal}&amount=${amount}`,
      { method: 'POST' }
    );
    if (res.ok) {
      setHasExchanged(true);
      await fetchState();
      await fetchStock();
    } else {
      alert('Wymiana nieudana.');
    }
  };

  const restart = async () => {
    await fetch('http://localhost:5228/Game/restart', { method: 'POST' });
    setWinner(null);
    setChanges({});
    setDice([]);
    setLastRollPlayer(null);
    await fetchState();
    await fetchStock();
  };

  useEffect(() => {
    fetchState();
    fetchStock();
  }, []);

  return (
    <div className="app-container" style={{ color: 'orange', width: '1000px', margin: '0 auto' }}>
      <h1>Super Farmer</h1>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={restart} className="button">Nowa gra</button>
        <button onClick={() => setShowRules(!showRules)} className="button">Zasady</button>
      </div>

      {showRules && <Roles />}

      {!state ? <h3>Ładowanie gry...</h3> : (
        <>
          <h2>Tura: {state.currentPlayer}</h2>
          <button onClick={rollDice} className="button">Rzut</button>

          <h2 className="dice">Kostki: {dice.join(', ')}</h2>
          {winner && <div className="winner">{winner} wygrywa!</div>}

          <div className="players">
            {Object.entries(state.players).map(([playerName, animals]) => (
              <PlayerBoard
                key={playerName}
                playerName={playerName}
                animals={animals}
                changes={changes}
                isActive={playerName === lastRollPlayer}
              />
            ))}
          </div>

          <h2>Główne stado:</h2>
          {stock && (
            <ul>
              {Object.entries(stock)
                .filter(([a]) => a in animalIcons)
                .map(([a, count]) => (
                  <li key={a}>
                    {animalIcons[a as AnimalType]} {a}: {count}
                  </li>
                ))}
            </ul>
          )}

          {state && stock && (
            <ExchangePanel
              fromAnimal={fromAnimal}
              toAnimal={toAnimal}
              amount={amount}
              setFromAnimal={setFromAnimal}
              setToAnimal={setToAnimal}
              setAmount={setAmount}
              isExchangeValid={() =>
                isExchangeValid(state.players[state.currentPlayer], stock, fromAnimal, toAnimal, amount, hasExchanged)
              }
              getExchangeError={() =>
                getExchangeError(state.players[state.currentPlayer], stock, fromAnimal, toAnimal, amount, hasExchanged)
              }
              exchange={exchange}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
