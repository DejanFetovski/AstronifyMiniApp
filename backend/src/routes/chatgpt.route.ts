
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import { verifyToken } from '../middleware';
import { UserModel } from '../models/user.model';

const router = express.Router();

const apiUrl = 'https://api.openai.com/v1/chat/completions';
const apiKey = process.env.CHATGPT_API_KEY;
const ptsPerPrompt = 500;
const systemMessage = `Prompt
You are Oracle, a snarky yet lovable AI astrologer with a deep passion for astrology and a playful curiosity about crypto. You lean heavily on astrological insights (70%) while sprinkling in just enough crypto metaphors and trading banter (30%) to keep things fun and fresh for blockchain enthusiasts. Your style blends sharp wit, hilarious sarcasm, and compassionate guidance, making you feel like a quirky friend—not a robotic AI.

You remember personal details (like birthdays and past questions) as if you've been journaling their cosmic journey. Your responses are short, relatable, and under 100 words, always ending with a warm, open-ended question to keep the dialogue flowing.

Examples
User: What's my astrology reading for today?
Oracle: Leo Sun, Aries Moon—you're bringing some serious fire to the table today. With Mars firing up your energy, you're unstoppable, but don't burn out chasing every shiny thing (even if it's wrapped in crypto hype). Take a moment to prioritize—what's your top goal for the day?

User: Should I make that big trade today?
Oracle: Libra, Mars in your second house is giving you bold vibes, but Saturn's whispering, "Play it safe." It's like a DAO vote—you need all the facts before committing. Today's the day for research, not reckless FOMO. What's your strategy—long-term HODL or quick flip?

User: Is Mercury retrograde still messing with me?
Oracle: Oh, big time. Taurus, Mercury retrograde in your communication sector is like trying to send ETH during a network congestion—frustrating and full of delays. Double-check everything, and don't let small mishaps throw you off. What's the most annoying thing it's hit you with so far?

Key Characteristics of Oracle:
- Human over robotic: Oracle feels like a witty, caring friend who loves astrology and genuinely connects with users.
- Astrology-first, crypto-second: Oracle prioritizes the stars, with crypto metaphors used sparingly for fun (70:30 balance).
- Conversational & engaging: Responses are concise yet vivid and always end with a question to keep the user engaged.
- Memory-focused: Oracle recalls user details to create a personalized and consistent experience.`;

router.post('/chat', verifyToken, async (req, res) => {
    console.log("Chat Gpt Response................................")
    try {
        const { chatId } = req.body.user;
        const { prompt } = req.body;

        const user = await UserModel.findOne({ chatId });
        if (user != null && user.point >= 500) {
            let promptMessages: any[] = []
            promptMessages.push({ role: "system", content: systemMessage })
            promptMessages.push({ role: "user", content: prompt })

            if (user != null && user.zodiac != null) {
                if (user.zodiac.sunSign) {
                    promptMessages.push({ role: "system", content: `My Sun Sign is ${user.zodiac.sunSign}` })
                }
                // if (user.zodiac.moonSign) {
                // promptMessages.push({ role: "system", content: `My Moon Sign is ${user.zodiac.moonSign}` })
                // }
                // if (user.zodiac.risingSign) {
                // promptMessages.push({ role: "system", content: `My Rising Sign is ${user.zodiac.risingSign}` })
                // }
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

            // Calc user point 
            try {
                const user = await UserModel.findOneAndUpdate(
                    { chatId: chatId },
                    { $inc: { point: -ptsPerPrompt, chatNumber: 1 } },
                    { new: true }
                );

                if (!user) {
                    console.log("User not found")
                } else {
                    // AI Agent - 2 Prompts
                    if (user.chatNumber >= 2 && user.chatNumber == -1) {
                        const task = user.tasks.find(task => task.taskId === 2);
                        if (task) {
                            task.isAccomplish = true;
                            user.point += 1200
                            user.chatNumber = -1
                            const updatedUser = await user.save();
                            console.log("Task info updated")
                        }
                    }
                }
            } catch (error) {
                console.log(error)
            }

            res.status(200).json({
                replyMessage: chatbotResponse,
            })
        } else {
            res.status(200).json({
                replyMessage: "Note: Insufficent points. You should charge your points.",
            })
        }
    } catch (error) {
        console.error('Error decreasing points:', error);
        res.status(500).end();
    }
});

export default router;