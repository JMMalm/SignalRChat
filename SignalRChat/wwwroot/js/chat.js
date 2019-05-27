"use strict";

$(document).ready(function () {
	console.log('jQuery has loaded.');
});

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

// Disable send button until connection is established.
$('#sendButton').prop('disabled', true);
//document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
	var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	var encodedMsg = user + ": \"" + msg + "\"";
	var li = document.createElement("li");
	li.textContent = encodedMsg;
	document.getElementById("messagesList").appendChild(li);
});

connection.start().then(function () {
	//document.getElementById("sendButton").disabled = false;
	$('#sendButton')
		.prop('disabled', false)
		.addClass('btn-primary');
}).catch(function (err) {
	return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
	var user = document.getElementById("userInput").value;
	var message = document.getElementById("messageInput").value;
	connection.invoke("SendMessage", user, message).catch(function (err) {
		return console.error(err.toString());
	});
	event.preventDefault();
});