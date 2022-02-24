namespace Aquarium.Infrastructure.Classes;

public class AquariumInfo<T> where T: FishBase
{
    public T FishBase { get; set; }
    public Map Map { get; set; }
}