using System;

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
