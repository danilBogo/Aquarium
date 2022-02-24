using System.Collections.Concurrent;
using Aquarium.Infrastructure.Classes;
using Aquarium.Infrastructure.Enums;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Aquarium.Infrastructure.SignalR;

public class AquariumHub : Hub
{
    private readonly Map _map;
    private const int _delay = 1000;
    
    public AquariumHub()
    {
        _map = new Map(800, 400);
    }

    public async Task<Map> GetMap() => _map;

    public bool TryCreateTaskFish(string json)
    {
        var taskFish = JsonConvert.DeserializeObject<TaskFish>(json);
        if (taskFish is null)
            return false;
        if (FishDictionary.Dictionary.ContainsKey(taskFish.FishId))
            return false;
        FishDictionary.Dictionary.Add(taskFish.FishId, taskFish);
        taskFish.StartMoving(_map, _delay);
        return true;
    }
    
    public bool TryCreateThreadFish(string json)
    {
        var threadFish = JsonConvert.DeserializeObject<ThreadFish>(json);
        if (threadFish is null)
            return false;
        if (FishDictionary.Dictionary.ContainsKey(threadFish.FishId))
            return false;
        FishDictionary.Dictionary.Add(threadFish.FishId, threadFish);
        threadFish.StartMoving(_map, _delay);
        return true;
    }

    public bool TryDeleteFishById(int fishId)
    {
        if (!FishDictionary.Dictionary.ContainsKey(fishId))
            return false;
        FishDictionary.Dictionary.Remove(fishId);
        return true;
    }

    public string GetFishJsonById(int fishId)
    {
        if (!FishDictionary.Dictionary.ContainsKey(fishId))
            return null;
        var fish = FishDictionary.Dictionary[fishId];
        var json = JsonSerializer.Serialize(fish);
        return json;
    }
}