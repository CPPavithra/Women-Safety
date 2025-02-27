// Function to create and display the chatbot
function createChatbot() {
    // Check if the chatbot container already exists
    if (document.getElementById('chatbot-container')) return;

    // Create the chatbot container and add it to the body
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-container';
    chatbotContainer.style.display = 'none';
    document.body.appendChild(chatbotContainer);

    // Create the chat window (hidden initially)
    const chatWindow = document.createElement('div');
    chatWindow.id = 'chat-window';
    chatbotContainer.appendChild(chatWindow);

    // Create chatbox to hold messages
    const chatbox = document.createElement('div');
    chatbox.id = 'chatbox';
    chatWindow.appendChild(chatbox);

    // Create an input field for user to type messages
    const userInput = document.createElement('input');
    userInput.id = 'user-input';
    userInput.placeholder = 'Type a message...';
    chatWindow.appendChild(userInput);

    // Create a send button
    const sendButton = document.createElement('button');
    sendButton.textContent = 'Send';
    sendButton.id = 'send-btn';
    chatWindow.appendChild(sendButton);

    // Event listener for send button to process user input
    sendButton.addEventListener('click', function() {
        const message = userInput.value.trim();
        if (message) {
            displayMessage(message, 'user');
            userInput.value = '';  // Clear input field
            sendToBot(message);
        }
    });

    // Function to display messages in the chatbox
    function displayMessage(message, sender) {
        const messageElement = document.createElement('p');
        messageElement.classList.add(sender);
        messageElement.textContent = message;
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight;  // Auto-scroll to the bottom
    }

    // Function to send the message to the bot and get a reply (using DeepSeek AI API)
    async function sendToBot(userMessage) {
        try {
            const response = await fetch('https://api.deepseek.com/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_API_KEY',  // Replace with your actual API key
                },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();
            const botReply = data.reply || "Sorry, I didn't understand that.";
            displayMessage(botReply, 'bot');
        } catch (error) {
            console.error('Error with API call:', error);
            displayMessage('Sorry, there was an issue. Please try again later.', 'bot');
        }
    }

    // Function to show the chatbot when the "Chat Now" button is clicked
    const chatNowButton = document.querySelector('.chat-btn');
    chatNowButton.addEventListener('click', function() {
        chatbotContainer.style.display = chatbotContainer.style.display === 'none' ? 'block' : 'none';
    });
}

