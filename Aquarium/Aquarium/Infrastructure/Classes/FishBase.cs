using Aquarium.Infrastructure.Enums;

namespace Aquarium.Infrastructure.Classes;

public abstract class FishBase
{
    public int FishId { get; }

    public int CurrentThreadId { get; set; } = -1;
    
    public Location Location { get; private set; }

    public Direction Direction { get; set; }

    public int SpeedX { get; }

    protected FishBase(Location location, Direction direction, int speedX, int fishId)
    {
        Location = location;
        Direction = direction;
        SpeedX = speedX;
        FishId = fishId;
    }

    public abstract void StartMoving(Map map, int delay);
    
    public abstract void StopMoving();

    protected void Move(Map map)
    {
        var newLocation = CalculateLocation();
        if (!map.IsFishInBoundaries(newLocation))
            newLocation = RotateFish(map, newLocation);
        Location = newLocation;
    }

    private Location RotateFish(Map map, Location location)
    {
        ChangeDirection();
        location.X = (2 * map.SizeX - location.X) % map.SizeX;
        return location;
    }

    private void ChangeDirection() => Direction = Direction == Direction.Left 
        ? Direction.Right 
        : Direction.Left;
    
    private Location CalculateLocation()
    {
        var location = Location;
        if (Direction == Direction.Right)
            location.X += SpeedX;
        else
            location.X -= SpeedX;
        return location;
    }
}