document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Function to handle sending the message
function sendMessage() {
    let inputField = document.getElementById('chat-input');
    let message = inputField.value.trim();

    if (message !== "") {
        appendMessage('user', message); // Append user's message to the chat window
        inputField.value = '';  // Clear the input field

        showTypingIndicator(); // Show the typing GIF

        // Get the current host dynamically to use for the API endpoint
        const apiHost = window.location.origin;

        // Send the message to the backend server
        fetch(`${apiHost}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        })
        .then(response => response.json())
        .then(data => {
            hideTypingIndicator(); // Hide the typing GIF
            appendMessage('bot', data.botMessage); // Append the bot's response to the chat window
        })
        .catch(error => {
            console.error('Error:', error);
            hideTypingIndicator(); // Hide the typing GIF on error
            appendMessage('bot', 'Error: Unable to get response from ChatGPT.');
        });
    }
}

// Function to append a message to the chat window (handles both user and bot messages)
function appendMessage(sender, message) {
    let chatWindow = document.getElementById('chat-window');
    let newMessage = document.createElement('div');
    
    newMessage.classList.add('chat-message', sender);

    // Check if the message contains code formatting (indicated by triple backticks)
    if (message.includes("```")) {
        const formattedMessage = formatCodeBlock(message);
        newMessage.innerHTML = `<pre>${formattedMessage}</pre>`;
    } else {
        // For plain text messages, handle line breaks by converting newlines to <br> tags
        const formattedMessage = message.replace(/\n/g, "<br>");
        newMessage.innerHTML = `<p>${formattedMessage}</p>`;
    }

    chatWindow.appendChild(newMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the bottom to show new message
}

// Function to handle code block formatting
function formatCodeBlock(message) {
    // Remove the triple backticks from the code block
    return message.replace(/```/g, '');
}

// Function to show the typing indicator (GIF)
function showTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'flex';
}

// Function to hide the typing indicator (GIF)
function hideTypingIndicator() {
    document.getElementById('typing-indicator').style.display = 'none';
}
