require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/ask', async (req, res) => {
    try {
        const { question } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: question }]}]  // Correct format
        });
        
        const response = await result.response;
        const text = response.text();

        res.json({ answer: text });

    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
// express → Handles API requests
// cors → Allows requests from your JavaScript frontend
// axios → Makes API calls to OpenAI
// dotenv → Manages environment variables (for security)
// npm install express cors axios dotenv
