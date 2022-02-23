using Microsoft.AspNetCore.SignalR;

namespace Aquarium.Infrastructure.SignalR;

public class ChatHub : Hub
{
    public async Task Send(string message)
    {
        await Clients.All.SendAsync("Send", message);
    }
}