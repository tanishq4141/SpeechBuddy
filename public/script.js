const recordButton = document.getElementById("recordButton");
const micIcon = document.getElementById("micIcon");
const transcription = document.getElementById("transcription");
const chatArea = document.getElementById("chatArea");
const messageInput = document.getElementById("messageInput");
const sendMessage = document.getElementById("sendMessage");

async function startRecording() {
    try {
        transcription.placeholder = "Listening...";
        micIcon.src = "Designer.jpeg";

        
        const response = await fetch('http://localhost:3000/record', { method: 'POST' });
        const data = await response.json();

        if (data.success && data.transcript) {
            transcription.value = data.transcript;
            addChatMessage(data.transcript, "user");

            generateAIResponse(data.transcript);
        } else {
            transcription.placeholder = "No speech detected.";
        }

        micIcon.src = "mic.png";
    } catch (error) {
        transcription.placeholder = "Error processing speech.";
        console.error(error);
    }
}

recordButton.addEventListener("click", startRecording);

async function generateAIResponse(userInput) {
    try {
        addChatMessage("Thinking...", "ai"); 

        const response = await fetch('http://localhost:3000/ai-response', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: userInput })
        });

        const data = await response.json();
        document.querySelector(".ai-message:last-child").remove(); 
        addChatMessage(data.response, "ai");
    } catch (error) {
        console.error("AI response error:", error);
    }
}

function addChatMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", sender === "user" ? "user-message" : "ai-message");
    messageDiv.innerText = text;
    chatArea.appendChild(messageDiv);
}

sendMessage.addEventListener("click", () => {
    if (messageInput.value.trim() !== "") {
        addChatMessage(messageInput.value, "user");
        generateAIResponse(messageInput.value);
        messageInput.value = "";
    }
});
