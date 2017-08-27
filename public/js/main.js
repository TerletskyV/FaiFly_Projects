"use strict";

var socket = io();
var form = document.getElementById('chatForm');
var messageBox = document.getElementById('messageBox');

var currentUsername = null;

// Get stored username.
function getCurrentUsername() {
    return localStorage
        ? localStorage.getItem('currentUsername')
        : currentUsername;
}

// Store current username
function setCurrentUsername(username) {
    localStorage.setItem('currentUsername', username);
}

// Set username in a form
form.querySelector('[name=username]').value = getCurrentUsername();

// Handle form submit event
form.addEventListener('submit', function(ev) {
    ev.preventDefault();

    // Use FormData for organising form values
    var formData = new FormData(form);

    currentUsername = formData.get('username');
    setCurrentUsername(currentUsername);

    // Send message
    socket.emit('chat message', {
        username: formData.get("username"),
        message: formData.get("message")
    });

    // Empty textarea
    form.querySelector('[name=message]').value = '';
});

// Handle receiving message
socket.on('chat message', function(message) {
    // Create message item
    var item = document.createElement('div');
    item.classList.add('row');
    var html = [
        '<div class="col s12 m6 ' + (getCurrentUsername() === message.username ? 'right' : '') + '">',
            '<div class="card blue-grey darken-1">',
                '<div class="card-content white-text">',
                    '<span class="card-title">' + message.username + '</span>',
                    '<p>' + message.message + '</p>',
                '</div>',
            '</div>',
        '</div>'
        ].join('');
    item.innerHTML = html;

    // Append message item
    messageBox.appendChild(item);
});