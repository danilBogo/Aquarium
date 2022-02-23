using Aquarium.Infrastructure.Classes;
using Aquarium.Infrastructure.Enums;

namespace Aquarium.Infrastructure.BackgroundServices;

public class Worker : BackgroundService
{
    readonly ILogger<Worker> _logger;

    public Worker(ILogger<Worker> logger)
    {
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var map = new Map(100, 100);
        var location1 = new Location(0, 10);
        var location2 = new Location(0, 20);
        var delay = 1000;

        var threadFish1 = new ThreadFish(1, location1, Direction.Right, 10);
        threadFish1.StartMoving(map, delay);
        var threadFish1Id = threadFish1.GetThreadId();
        //
        // var threadFish2 = new ThreadFish(1, location2, Direction.Right, 5);
        // threadFish2.StartMoving(map, delay);
        // var threadFish2Id = threadFish2.GetThreadId();
        
        var taskFish1 = new TaskFish(1, location1, Direction.Right, 10);
        taskFish1.StartMoving(map, delay);
        
        // var taskFish2 = new TaskFish(1, location2, Direction.Right, 5);
        // taskFish2.StartMoving(map, delay);

        while (!stoppingToken.IsCancellationRequested)
        {
            // ShowLogs(threadFish1, threadFish1Id);
            // ShowLogs(threadFish2, threadFish2Id);
            ShowLogs(threadFish1, threadFish1.GetThreadId());
            ShowLogs(taskFish1, taskFish1.GetTaskId());
            // ShowLogs(taskFish2);
            await Task.Delay(delay, stoppingToken);
        }
    }

    private void ShowLogs(FishBase fish, int id ) =>
        _logger.LogInformation($"X: {fish.Location.X} Y: {fish.Location.Y} Dir: {fish.Direction} Id: {id}");
}