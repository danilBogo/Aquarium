using Aquarium.Infrastructure.Enums;

namespace Aquarium.Infrastructure.Classes;

public class ThreadFish : FishBase
{
    private readonly CancellationTokenSource _cancelTokenSource = new();
    
    public ThreadFish(Location location, Direction direction, int speedX, int fishId) : base(location,
        direction, speedX, fishId)
    {
    }
    
    private void DoMoving(Map map, int delay)
    {
        while (!_cancelTokenSource.IsCancellationRequested)
        {
            Move(map);
            Thread.Sleep(delay);
        }
    }

    public override void StartMoving(Map map, int delay)
    {
        var thread = new Thread(() => DoMoving(map, delay));
        thread.Start();
        CurrentThreadId = thread.ManagedThreadId;
    }

    public override void StopMoving() => _cancelTokenSource.Cancel();
}