
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import { verifyToken } from '../middleware';
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
        const { prompt } = req.body;

        const user = await UserModel.findOne({ chatId });

        let promptMessages: any[] = []
        promptMessages.push({ role: "system", content: systemMessage })
        promptMessages.push({ role: "user", content: prompt })

        if (user != null && user.zodiac != null) {
            if (user.zodiac.sunSign) {
                promptMessages.push({ role: "system", content: `My Sun Sign is ${user.zodiac.sunSign}` })
            }
            if (user.zodiac.moonSign) {
                promptMessages.push({ role: "system", content: `My Moon Sign is ${user.zodiac.moonSign}` })
            }
            if (user.zodiac.risingSign) {
                promptMessages.push({ role: "system", content: `My Rising Sign is ${user.zodiac.risingSign}` })
            }
            if (user.zodiac.element) {
                promptMessages.push({ role: "system", content: `My Element is ${user.zodiac.element}` })
            }
            if (user.zodiac.luckyNo) {
                promptMessages.push({ role: "system", content: `My Lucky Number is ${user.zodiac.luckyNo}` })
            }
            if (user.zodiac.chineseZodiac) {
                promptMessages.push({ role: "system", content: `My Chinese Zodiac is ${user.zodiac.chineseZodiac}` })
            }
            if (user.setting.birth) {
                const date = new Date(user.setting.birth);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
                const day = date.getDate().toString().padStart(2, '0');

                const formattedDate = `${year}-${month}-${day}`;
                promptMessages.push({ role: "system", content: `My BirthDay is ${formattedDate}` })
            }
            if (user.setting.birthTime) {
                const [hour, minute] = user.setting.birthTime.split(':');
                promptMessages.push({ role: "system", content: `My BirthTime is ${hour}:${minute}` })
            }

        }

        const response = await axios.post(apiUrl, {
            model: 'gpt-4',
            messages: promptMessages,
            max_tokens: 2048,
            temperature: 1.0,
            top_p: 1.0,
            frequency_penalty: 1.0,
            presence_penalty: 0.65
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