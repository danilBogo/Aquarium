using Aquarium.Infrastructure.Enums;

namespace Aquarium.Infrastructure.Classes;

public class TaskFish : FishBase
{
    private readonly CancellationTokenSource _cancelTokenSource = new();
    
    public TaskFish(Location location, Direction direction, int speedX, int fishId) : base(location,
        direction, speedX, fishId)
    {
    }

    private void DoMoving(Map map, int delay)
    {
        Task.Run(() =>
        {
            Move(map);
            Thread.Sleep(delay);
            DoMoving(map, delay);
        }, _cancelTokenSource.Token);
        CurrentThreadId = Environment.CurrentManagedThreadId;
    }

    public override void StartMoving(Map map, int delay) => DoMoving(map, delay);

    public override void StopMoving() => _cancelTokenSource.Cancel();
}
