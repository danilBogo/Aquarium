using Aquarium.Infrastructure.Enums;

namespace Aquarium.Infrastructure.Classes;

public class ThreadFish : FishBase
{
    private readonly CancellationTokenSource _cancelTokenSource = new();
    
    public ThreadFish(Location location, Direction direction, int speedX, int fishId) : base(location,
        direction, speedX, fishId)
    {
    }

    public override void StartMoving(Aquarium aquarium, int delay)
    {
        var thread = new Thread(() =>
        {
            while (!_cancelTokenSource.IsCancellationRequested)
            {
                Move(aquarium);
                Thread.Sleep(delay);
            }
        });
        thread.Start();
        CurrentThreadId = thread.ManagedThreadId;
    }

    public override void StopMoving() => _cancelTokenSource.Cancel();
}