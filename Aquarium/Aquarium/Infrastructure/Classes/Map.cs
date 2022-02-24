namespace Aquarium.Infrastructure.Classes;

public class Map
{
    public int SizeX { get; set; }

    public int SizeY { get; set; }

    public Map(int sizeX, int sizeY)
    {
        SizeX = sizeX;
        SizeY = sizeY;
    }

    public bool IsFishInBoundaries(Location fishLocation) => fishLocation.X <= SizeX && fishLocation.X >= 0 &&
                                                             fishLocation.Y <= SizeY && fishLocation.Y >= 0;
}