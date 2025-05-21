namespace Models
{
    public enum AnimalType
    {
        Królik,
        Owca,
        Świnia,
        Krowa,
        Koń,
        MałyPies,
        DużyPies
    }

    public class Dice
    {
        private static readonly Random rng = new();
        private readonly string[] sides;

        public Dice(string[] sides)
        {
            this.sides = sides;
        }

        public string Roll()
        {
            int index = rng.Next(sides.Length);
            return sides[index];
        }
    }

    public class Player
    {
        public Dictionary<AnimalType, int> Animals { get; private set; } = new();
        public string Name { get; }

        public Player(string name)
        {
            Name = name;
            foreach (AnimalType type in Enum.GetValues(typeof(AnimalType)))
                Animals[type] = 0;
            Animals[AnimalType.Królik] = 1;
        }

        public bool HasFullHerd()
        {
            return Animals[AnimalType.Królik] > 0 &&
                   Animals[AnimalType.Owca] > 0 &&
                   Animals[AnimalType.Świnia] > 0 &&
                   Animals[AnimalType.Krowa] > 0 &&
                   Animals[AnimalType.Koń] > 0;
        }
    }

    public class Game
    {
        public List<Player> Players { get; } = new();
        private int currentPlayerIndex = 0;
        public Player CurrentPlayer => Players[currentPlayerIndex];

        public Dictionary<AnimalType, int> HerdStock { get; private set; } = new()
        {
            [AnimalType.Królik] = 60,
            [AnimalType.Owca] = 24,
            [AnimalType.Świnia] = 20,
            [AnimalType.Krowa] = 12,
            [AnimalType.Koń] = 6,
            [AnimalType.MałyPies] = 4,
            [AnimalType.DużyPies] = 2
        };

        private readonly Dice dice1 = new(new[] { "Królik", "Królik", "Królik", "Królik", "Królik", "Królik", "Owca", "Owca", "Owca", "Świnia", "Krowa", "Wilk" });
        private readonly Dice dice2 = new(new[] { "Owca", "Owca", "Owca", "Owca", "Owca", "Owca", "Owca", "Owca", "Świnia", "Świnia", "Koń", "Lis" });

        public void AddPlayer(string name)
        {
            Players.Add(new Player(name));
        }

        public void ResetGame()
        {
            Players.Clear();
            currentPlayerIndex = 0;
            HerdStock = new()
            {
                [AnimalType.Królik] = 60,
                [AnimalType.Owca] = 24,
                [AnimalType.Świnia] = 20,
                [AnimalType.Krowa] = 12,
                [AnimalType.Koń] = 6,
                [AnimalType.MałyPies] = 4,
                [AnimalType.DużyPies] = 2
            };
        }

        public (string, string) RollDice() => (dice1.Roll(), dice2.Roll());

        public void NextTurn() => currentPlayerIndex = (currentPlayerIndex + 1) % Players.Count;

        public bool TryExchange(Player player, AnimalType from, AnimalType to, int amount)
        {
            var conversionRates = new Dictionary<(AnimalType, AnimalType), int>
            {
                [(AnimalType.Królik, AnimalType.Owca)] = 6,
                [(AnimalType.Owca, AnimalType.Świnia)] = 2,
                [(AnimalType.Świnia, AnimalType.Krowa)] = 3,
                [(AnimalType.Krowa, AnimalType.Koń)] = 2,

                [(AnimalType.Owca, AnimalType.Królik)] = 1,
                [(AnimalType.Świnia, AnimalType.Owca)] = 2,
                [(AnimalType.Krowa, AnimalType.Świnia)] = 3,
                [(AnimalType.Koń, AnimalType.Krowa)] = 2
            };

            if (!conversionRates.TryGetValue((from, to), out int rate)) return false;

            int required = rate * amount;
            if (player.Animals[from] < required || HerdStock[to] < amount) return false;

            player.Animals[from] -= required;
            player.Animals[to] += amount;

            HerdStock[from] += required;
            HerdStock[to] -= amount;

            return true;
        }

        public Dictionary<AnimalType, int> ResolveAnimals(Player player, string die1, string die2)
        {
            var changes = new Dictionary<AnimalType, int>();
            foreach (AnimalType type in Enum.GetValues(typeof(AnimalType)))
                changes[type] = 0;

            var diceAnimals = new[] { die1, die2 }
                .Where(a => a != "Wilk" && a != "Lis")
                .GroupBy(a => a)
                .ToDictionary(g => g.Key, g => g.Count());

            foreach (var kv in diceAnimals)
            {
                if (Enum.TryParse(kv.Key, out AnimalType type))
                {
                    if ((type == AnimalType.Krowa || type == AnimalType.Koń) && player.Animals[type] == 0) continue;

                    int pairs = player.Animals[type] / 2 + kv.Value;
                    int gain = Math.Min(pairs, HerdStock[type]);
                    player.Animals[type] += gain;
                    HerdStock[type] -= gain;
                    changes[type] += gain;
                }
            }

            if (die1 == "Lis" || die2 == "Lis")
            {
                if (player.Animals[AnimalType.MałyPies] > 0)
                {
                    player.Animals[AnimalType.MałyPies]--;
                    HerdStock[AnimalType.MałyPies]++;
                    changes[AnimalType.MałyPies]--;
                }
                else
                {
                    int lost = Math.Max(0, player.Animals[AnimalType.Królik] - 1);
                    player.Animals[AnimalType.Królik] = Math.Min(player.Animals[AnimalType.Królik], 1);
                    changes[AnimalType.Królik] -= lost;
                }
            }

            if (die1 == "Wilk" || die2 == "Wilk")
            {
                if (player.Animals[AnimalType.DużyPies] > 0)
                {
                    player.Animals[AnimalType.DużyPies]--;
                    HerdStock[AnimalType.DużyPies]++;
                    changes[AnimalType.DużyPies]--;
                }
                else
                {
                    foreach (var type in new[] { AnimalType.Owca, AnimalType.Świnia, AnimalType.Krowa })
                    {
                        changes[type] -= player.Animals[type];
                        player.Animals[type] = 0;
                    }
                }
            }

            return changes;
        }
    } 
}
