require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const say = require('say');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const record = require('node-record-lpcm16').record;
const speech = require('@google-cloud/speech');


process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const client = new speech.SpeechClient();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// Function to record and transcribe speech
async function recordText() {
    return new Promise((resolve, reject) => {
        const audioChunks = [];

        console.log("Listening...");

        const recordingStream = record({
            sampleRateHertz: 16000,
            threshold: 0,
            verbose: false,
            recordProgram: 'sox'
        }).stream();

        recordingStream.on('data', chunk => audioChunks.push(chunk));

        setTimeout(() => {
            recordingStream.pause(); // Stop recording after 5 seconds
            const audioBuffer = Buffer.concat(audioChunks);
            const audioBytes = audioBuffer.toString('base64');

            const request = {
                config: { encoding: 'LINEAR16', sampleRateHertz: 16000, languageCode: 'en-US' },
                audio: { content: audioBytes }
            };

            client.recognize(request)
                .then(data => {
                    if (!data || !data[0]?.results?.length) {
                        console.error("Error: No speech detected.");
                        resolve(null);
                    } else {
                        const transcript = data[0].results.map(result => result.alternatives[0].transcript).join('\n');
                        resolve(transcript);
                    }
                })
                .catch(err => {
                    console.error("Speech-to-Text Error:", err);
                    reject(`Could not process audio: ${err}`);
                });
        }, 5000);
    });
}

// Function to generate response from Gemini AI
async function geminiOutput(text) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const response = await model.generateContent(text);

        if (!response || !response.response || !response.response.candidates || response.response.candidates.length === 0) {
            console.error("Error: No response from Gemini.");
            return "Error: No response from Gemini.";
        }

        const content = response.response.candidates[0]?.content?.parts?.map(part => part.text).join(" ") || "Error: Empty response.";
        return content.trim();
    } catch (error) {
        console.error("Error with Gemini API:", error);
        return "Error: Unable to process request.";
    }
}

// Function to convert text to speech
function textToSpeech(text) {
    say.speak(text);
}


app.post('/record', async (req, res) => {
    try {
        const transcript = await recordText();
        res.json({ success: !!transcript, transcript });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


app.post('/ai-response', async (req, res) => {
    try {
        const response = await geminiOutput(req.body.text);
        textToSpeech(response);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => console.log(`✅ Server running on http://localhost:${port}`));
