using Aquarium.Infrastructure.Classes;

namespace Aquarium.Infrastructure.SignalR;

public static class FishDictionary
{
    public static readonly Dictionary<int, FishBase> Dictionary = new();
}