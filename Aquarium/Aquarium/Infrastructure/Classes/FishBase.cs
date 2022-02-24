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

    public abstract void StartMoving(Aquarium aquarium, int delay);
    
    public abstract void StopMoving();

    protected void Move(Aquarium aquarium)
    {
        var newLocation = CalculateLocation();
        if (!aquarium.IsFishInBoundaries(newLocation))
            newLocation = RotateFish(aquarium, newLocation);
        Location = newLocation;
    }

    private Location RotateFish(Aquarium aquarium, Location location)
    {
        ChangeDirection();
        location.X = (2 * aquarium.SizeX - location.X) % aquarium.SizeX;
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