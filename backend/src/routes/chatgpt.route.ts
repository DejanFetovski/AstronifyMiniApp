
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import session from 'express-session';
import { verifyToken } from '../middleware';
import { ChatSessionModel } from '../models/chatsession.model';

const router = express.Router();

const apiUrl = 'https://api.openai.com/v1/chat/completions';
const apiKey = process.env.CHATGPT_API_KEY;

router.post('/chat', verifyToken, async (req, res) => {
    console.log("Chat Gpt Response................................")
    try {
        const { chatId } = req.body.user;
        const { prompt, categoryId } = req.body;
        console.log("Prompt................................", prompt)
        console.log("categoryId............................", categoryId)

        // Save chat session to database
        await ChatSessionModel.create({
            chatId,
            categoryId,
            role: 'user',
            content: prompt
        });

        const session = await ChatSessionModel.find({ chatId, categoryId, role:'user' })
        console.log("Session Data................................", session)

        let promptMessages: any[] = session.map(obj => ({
            role: obj.role,
            content: obj.content
        }));

        console.log("Session Data................................", promptMessages)

        const response = await axios.post(apiUrl, {
            model: 'gpt-4',
            messages:promptMessages,
            max_tokens: 500,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const chatbotResponse = response.data.choices[0].message.content.trim();
        console.log("chatbotResponse................................", chatbotResponse)

        // await ChatSessionModel.create({
        //     chatId,
        //     categoryId,
        //     role: 'assist',
        //     content: chatbotResponse
        // });

        res.status(200).json({
            replyMessage: chatbotResponse,
        })
    } catch (error) {
        console.log("gpt error................................", error)

        res.status(500).end();
    }
});

export default router;