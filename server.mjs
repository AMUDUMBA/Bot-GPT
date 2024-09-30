import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 3000; // Use PORT set by Render

// Middleware to parse JSON requests and enable CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route to serve the root URL "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Your route for handling chatbot requests
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    const requestBody = {
        model: "gpt-4",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: userMessage }
        ]
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        const botMessage = data.choices[0].message.content;
        res.json({ botMessage });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'Failed to get response from ChatGPT' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
