using Aquarium.Infrastructure.Enums;

namespace Aquarium.Infrastructure.Classes;

public class TaskFish : FishBase
{
    private int _taskId;
    
    public TaskFish(int fishId, Location location, Direction direction, int speedX) : base(fishId, location,
        direction, speedX)
    {
    }

    private void DoMoving(Map map, int delay)
    {
        var task = Task.Run(delegate
        {
            Move(map);
            Thread.Sleep(delay);
            DoMoving(map, delay);
        });
        _taskId = task.Id;
    }

    public override void StartMoving(Map map, int delay) => DoMoving(map, delay);

    public int GetTaskId() => _taskId;
}