using System.Collections.Concurrent;
using Aquarium.Infrastructure.Classes;
using Aquarium.Infrastructure.Enums;
using Microsoft.AspNetCore.SignalR;

namespace Aquarium.Infrastructure.SignalR;

public class AquariumHub : Hub
{
    private readonly Map _map;
    private const int _delay = 1000;
    private readonly Dictionary<int, FishBase> _listFishes = new();
    
    public AquariumHub()
    {
        _map = new Map(200, 100);
    }

    public async Task<Map> GetMap() => _map;

    public bool TryCreateTaskFish(int fishId, Location location, Direction direction, int speedX)
    {
        var taskFish = new TaskFish(location, direction, speedX);
        if (_listFishes.ContainsKey(fishId))
            return false;
        _listFishes.Add(fishId, taskFish);
        taskFish.StartMoving(_map, _delay);
        return true;
    }
    
    public bool TryCreateThreadFish(int fishId, Location location, Direction direction, int speedX)
    {
        var threadFish = new ThreadFish(location, direction, speedX);
        if (_listFishes.ContainsKey(fishId))
            return false;
        _listFishes.Add(fishId, threadFish);
        threadFish.StartMoving(_map, _delay);
        return true;
    }

    public bool TryDeleteFishById(int fishId)
    {
        if (!_listFishes.ContainsKey(fishId))
            return false;
        _listFishes.Remove(fishId);
        return true;
    }
}