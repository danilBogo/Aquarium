using Aquarium.Infrastructure.Enums;

namespace Aquarium.Infrastructure.Classes;

public class TaskFish : FishBase
{
    private Timer _timer;
    private readonly CancellationTokenSource _cancelTokenSource = new();
    
    public TaskFish(Location location, Direction direction, int speedX, int fishId) : base(location,
        direction, speedX, fishId)
    {
    }

    private void InvokeTask(object? data)
    {
        if (data is not Map aquarium)
            return;
        var task = Task.Run(() => Move(aquarium), _cancelTokenSource.Token);
        CurrentThreadId = task.Id;
        Console.WriteLine(task.Id);
    }

    public override void StartMoving(Map map, int delay)
    {
        _timer = new Timer(InvokeTask, map, 0, delay);
    }

    public override void StopMoving()
    {
        _cancelTokenSource.Cancel();
        _timer.Dispose();
    }
}
