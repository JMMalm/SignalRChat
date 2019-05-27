using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace SignalRChat.Hubs
{
	public class ChatHub : Hub
	{
		public async Task SendMessage(string user, string message)
		{
			await Clients.All.SendAsync("ReceiveMessage", user, $"{message} ({DateTime.Now})");
		}

		// https://docs.microsoft.com/en-us/aspnet/core/signalr/hubs?view=aspnetcore-2.2#send-messages-to-clients
		public Task SendMessageToCaller(string message)
		{
			return Clients.Caller.SendAsync("ReceiveMessage", message);
		}
	}
}