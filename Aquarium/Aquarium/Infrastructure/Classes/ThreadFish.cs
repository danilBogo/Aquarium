using Aquarium.Infrastructure.Enums;

namespace Aquarium.Infrastructure.Classes;

public class ThreadFish : FishBase
{
    private int _threadId;
    
    public ThreadFish(int fishId, Location location, Direction direction, int speedX) : base(fishId, location,
        direction, speedX)
    {
    }

    private void DoMoving(Map map, int delay)
    {
        while (true)
        {
            Move(map);
            Thread.Sleep(delay);
        }
    }

    public override void StartMoving(Map map, int delay)
    {
        var thread = new Thread(() => DoMoving(map, delay));
        thread.Start();
        _threadId = thread.ManagedThreadId;
    }

    public int GetThreadId() => _threadId;
}