using System.Collections.Concurrent;
using Aquarium.Infrastructure.Classes;
using Aquarium.Infrastructure.Enums;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;


namespace Aquarium.Infrastructure.SignalR;

public class AquariumHub : Hub
{
    private const int Delay = 16;

    private bool TryCreateFish<T>(string json) where T : FishBase
    {
        var aquariumInfo = JsonConvert.DeserializeObject<AquariumInfo<T>>(json);
        if (aquariumInfo is null)
            return false;
        if (FishDictionary.Dictionary.ContainsKey(aquariumInfo.FishBase.FishId))
            return false;
        FishDictionary.Dictionary.Add(aquariumInfo.FishBase.FishId, aquariumInfo.FishBase);
        aquariumInfo.FishBase.StartMoving(aquariumInfo.Map, Delay);
        return true;
    }

    public bool TryCreateTaskFish(string json) => TryCreateFish<TaskFish>(json);
    
    public bool TryCreateThreadFish(string json) => TryCreateFish<ThreadFish>(json);

    public bool TryCleanDictionaryFishes()
    {
        FishDictionary.Dictionary.Clear();
        return true;
    }
    
    public bool TryDeleteFishById(int fishId)
    {
        if (!FishDictionary.Dictionary.ContainsKey(fishId))
            return false;
        FishDictionary.Dictionary.Remove(fishId);
        return true;
    }

    public string? GetFishJsonById(int fishId)
    {
        if (!FishDictionary.Dictionary.ContainsKey(fishId))
            return null;
        var fish = FishDictionary.Dictionary[fishId];
        var json = JsonSerializer.Serialize(fish);
        return json;
    }
}