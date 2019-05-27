"use strict";

$(document).ready(function () {
	console.log('jQuery has loaded.');
});

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

// Disable send button until connection is established.
$('#sendButton').prop('disabled', true);

connection.on("ReceiveMessage", function (user, message) {
	var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	var encodedMsg = user + ": \"" + msg + "\"";
	$('#messagesList').append('<li>' + encodedMsg + '</li>');
});

connection.start().then(function () {
	$('#sendButton')
		.prop('disabled', false)
		.addClass('btn-primary');
}).catch(function (err) {
	return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
	var user = $('#userInput').val();
	var message = $('#messageInput').val();
	connection.invoke("SendMessage", user, message).catch(function (err) {
		return console.error(err.toString());
	});
	event.preventDefault();
});