using System.Collections.Generic;

public class Player
{
    public Dictionary<AnimalType, int> Animals { get; private set; } = new();
    public string Name { get; }

    public Player(string name)
    {
        Name = name;
        foreach (AnimalType type in Enum.GetValues(typeof(AnimalType)))
        {
            Animals[type] = 0;
        }
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
