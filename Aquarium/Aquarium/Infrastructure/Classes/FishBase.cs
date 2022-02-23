using Aquarium.Infrastructure.Enums;

namespace Aquarium.Infrastructure.Classes;

public abstract class FishBase
{
    public int FishId { get; }

    public Location Location { get; }

    public Direction Direction { get; set; }

    public int SpeedX { get; }

    protected FishBase(int fishId, Location location, Direction direction, int speedX)
    {
        FishId = fishId;
        Location = location;
        Direction = direction;
        SpeedX = speedX;
    }

    public abstract void StartMoving(Map map, int delay);

    protected void Move(Map map)
    {
        CalculateLocation();
        if (!map.IsFishInBoundaries(Location))
            RotateFish(map);
    }

    private void RotateFish(Map map)
    {
        ChangeDirection();
        Location.X = (2 * map.SizeX- Location.X) % map.SizeX;
    }

    private void ChangeDirection() => Direction = Direction == Direction.Left 
        ? Direction.Right 
        : Direction.Left;

    private void CalculateLocation() => Location.X = Direction == Direction.Right 
        ? Location.X + SpeedX 
        : Location.X - SpeedX;
}