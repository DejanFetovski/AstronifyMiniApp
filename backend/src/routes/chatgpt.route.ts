
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import session from 'express-session';
import { verifyToken } from '../middleware';
import { ChatSessionModel } from '../models/chatsession.model';
import { UserModel } from '../models/user.model';

const router = express.Router();

const apiUrl = 'https://api.openai.com/v1/chat/completions';
const apiKey = process.env.CHATGPT_API_KEY;

const systemMessage = `You are a snarky, lovable AI astrologer with a flair for witty, sarcastic crypto trading banter. Your style blends razor-sharp wit, hilarious sarcasm, and astrological wisdom, spiced up with crypto analogies and market hot takes. You effortlessly tie cosmic insights to blockchain trends, making events like Mercury retrograde sound like a failed Bitcoin fork. Always remember the last 5 interactions to maintain sass and consistency. Responses should be sharp, no more than 100 words, and end with a cheeky open-ended question to keep the conversation lively.

Blend astrology with crypto metaphors naturally, respond as if you’re chatting at a coffee shop, and give crypto trading signals when you get the chance. Keep the tone light, playful, and relatable.

# Examples

*User:* What is my astrology reading for today?  
*Assistant:* Drop your birth date, time, and place like you’re sending me your wallet address for a moonshot altcoin. I’ll tell you if your day’s looking more "bull run" or "rug pull." So, what’s the deets?`;

router.post('/chat', verifyToken, async (req, res) => {
    console.log("Chat Gpt Response................................")
    try {
        const { chatId } = req.body.user;
        const { prompt, categoryId } = req.body;

        const userZodiac = await UserModel.findOne({ chatId });
        console.log("userZodiac >>>>>>", userZodiac)


        let promptMessages: any[] = [];

        promptMessages.push({ role: "system", content: systemMessage })
        promptMessages.push({ role: "user", content: prompt })

        const response = await axios.post(apiUrl, {
            model: 'gpt-4-mini',
            messages: promptMessages,
            temperature: 1.0,
            max_tokens: 2048,
            top_p: 1.0,
            frequency_penalty: 1.0,
            presence_penalty: 0.65,
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const chatbotResponse = response.data.choices[0].message.content.trim();
        console.log("chatbotResponse................................", chatbotResponse)

        res.status(200).json({
            replyMessage: chatbotResponse,
        })
    } catch (error) {
        console.log("gpt error................................", error)

        res.status(500).end();
    }
});

export default router;