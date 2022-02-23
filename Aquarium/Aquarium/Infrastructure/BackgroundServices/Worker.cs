using Aquarium.Infrastructure.Classes;
using Aquarium.Infrastructure.Enums;
using Aquarium.Infrastructure.SignalR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;

namespace Aquarium.Infrastructure.BackgroundServices;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    
    public Worker(ILogger<Worker> logger)
    {
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // IHubContext hubContext = GlobalHost.ConnectionManager.GetHubContext<AquariumHub>();
        // hubContext.Clients.All.addMessage("server", "ServerMessage");
        // await _hub.Clients.All.SendAsync("send", "123");
        // await _hub.Clients.All.SendAsync("send", "123");
        // await _hub.Clients.All.SendAsync("send", "123");

        // var connection = new HubConnectionBuilder()
        //     .WithUrl("https://localhost:7060/aquarium")
        //     .Build();
        // await connection.InvokeAsync("send", "Hello1");
        //
        // while (!stoppingToken.IsCancellationRequested)
        // {
        //     Console.WriteLine("pizdec");
        // }
        // connection.On<Order>("NewOrder", (order) => 
        //     Console.WriteLine($"Somebody ordered an {order.Product}"));
        //
        // connection.StartAsync().GetAwaiter().GetResult();
        //
        // Console.WriteLine("Listening. Press a key to quit");
        // Console.ReadKey();

        // while (!stoppingToken.IsCancellationRequested)
        // {
        //     
        // }
    }

    // private void ShowLogs(FishBase fish, int id ) =>
    //     _logger.LogInformation($"X: {fish.Location.X} Y: {fish.Location.Y} Dir: {fish.Direction} Id: {id}");
}