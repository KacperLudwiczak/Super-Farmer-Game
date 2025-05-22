import type { AnimalType } from "../Interfaces/Interfaces";
import { animalIcons } from "../Interfaces/Interfaces";

interface Props {
  fromAnimal: AnimalType;
  toAnimal: AnimalType;
  amount: number;
  setFromAnimal: (v: AnimalType) => void;
  setToAnimal: (v: AnimalType) => void;
  setAmount: (v: number) => void;
  isExchangeValid: () => boolean;
  getExchangeError: () => string | null;
  exchange: () => void;
}

export default function ExchangePanel({
  fromAnimal,
  toAnimal,
  amount,
  setFromAnimal,
  setToAnimal,
  setAmount,
  isExchangeValid,
  getExchangeError,
  exchange
}: Props) {
  return (
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
        {!isExchangeValid() && (
          <h3 style={{ color: 'orange', marginBottom: '0.25rem' }}>
            {getExchangeError()}
          </h3>
        )}
      </div>
    </div>
  );
}
