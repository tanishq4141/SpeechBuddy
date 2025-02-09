# SpeechBuddy
Your personal voice ai Assistance

Here’s a README.md for your Speech-to-Speech AI Website project:

🗣️ Speech-to-Speech AI Website

A Node.js-powered web application that converts speech to text, generates AI-based responses using Google Gemini AI, and converts text back to speech.

🚀 Features

✅ Speech-to-Text – Uses Google Cloud Speech-to-Text API
✅ AI-Powered Responses – Powered by Google Gemini AI
✅ Text-to-Speech – Uses say library for voice output
✅ Frontend + Backend – Built with HTML, CSS, and Node.js
✅ Cross-Origin Support – Uses CORS

🛠️ Installation

1️⃣ Clone the Repository

git clone https://github.com/your-username/speech-to-speech-ai.git
cd speech-to-speech-ai

2️⃣ Install Dependencies

npm install

3️⃣ Set Up Environment Variables

Create a .env file in the project root and add:

GEMINI_API_KEY=your-gemini-api-key
GOOGLE_CREDENTIALS=your-google-credentials.json

	⚠️ Do not commit the .env file to GitHub!

▶️ Run the Server

npm start

Your server will be live at http://localhost:3000

🌎 Deployment

Railway / Render Deployment
	1.	Push your project to GitHub.
	2.	Deploy using Railway or Render.
	3.	Add Environment Variables in the cloud dashboard:
	•	GEMINI_API_KEY
	•	GOOGLE_CREDENTIALS (Paste full JSON content)
	4.	Redeploy the project.

Your website will be live at:
🔗 https://your-app-name.up.railway.app

📂 Project Structure

/speech-to-speech-ai
├── /public         # Frontend files (HTML, CSS, JS)
├── server.js       # Node.js backend
├── package.json    # Dependencies
├── .env            # API keys (ignored in Git)
├── README.md       # Project documentation

🤝 Contributing

Feel free to fork this repo, make improvements, and submit pull requests!

📜 License

MIT License

✨ Happy Coding! 🚀

Let me know if you need changes! 😊

