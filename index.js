import express from "express"
import cors from "cors"
import "dotenv/config"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const PORT = process.env.PORT || 8080
const API_KEY = process.env.API_KEY
const app = express()

app.use(cors())

app.get('/', (req, res) => {
  res.send('JarvisAPI')
})

app.get('/api', async (req, res) => {
  const prompt = req.query.prompt

  const genAI = new GoogleGenerativeAI(API_KEY)

  const generationConfig = {
    maxOutputTokens: 1000,
    temperature: 0.9,
    topP: 0.1,
    topK: 16,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig, safetySettings });

  const result = await model.generateContent(prompt);
  res.status(200).json({ "AIresponse": result.response.text() })
})

app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`)
})
