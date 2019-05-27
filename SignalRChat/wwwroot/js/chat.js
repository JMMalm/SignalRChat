"use strict";

$(document).ready(function () {
	console.log('jQuery has loaded.');
});

// SignalR //
var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

// Disable send button until connection is established.
$('#sendButton').prop('disabled', true);

connection.on("ReceiveMessage", function (user, message) {
	var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	var encodedMsg = user + ": \"" + msg + "\"";
	$('#messagesList').append('<li>' + encodedMsg + '</li>');
});

connection
	.start()
	.then(function () {
		$('.toast').toast('show');
	})
	.catch(function (err) {
		return console.error(err.toString());
	});

// jQuery Events //
$("#sendButton").on("click", function (event) {
	var user = $('#userInput').val();
	var message = $('#messageInput').val();
	if (!isNullOrWhiteSpace(user) && !isNullOrWhiteSpace(message)) {	
		connection
			.invoke("SendMessage", user, message)
			.then(function () {
				$('#messageInput').val('');
				toggleSendButton();
			})
			.catch(function (err) {
				return console.error(err.toString());
			});
	}
	event.preventDefault();
});

$('#userInput, #messageInput').change(function () {
	toggleSendButton();
});

// Accessory Functions //
function isNullOrWhiteSpace(value) {
	return (value === undefined || value.length === 0);
}

function toggleSendButton() {
	var user = $('#userInput').val();
	var message = $('#messageInput').val();
	if (isNullOrWhiteSpace(user) || isNullOrWhiteSpace(message)) {
		$('#sendButton')
			.prop('disabled', true)
			.removeClass('btn-primary');
	}
	else {
		$('#sendButton')
			.prop('disabled', false)
			.addClass('btn-primary');
	}
}