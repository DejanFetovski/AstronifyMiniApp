import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'
import { verifyToken } from '../middleware'

dotenv.config()

const router = express.Router()

const url = `https://json.astrologyapi.com/v1`
const userId = '636703';
const apiKey = 'c2772e60f7225e813b6da1c6babefc69f15d21e7';

const astronologyAPI = async (api: string, data: any) : Promise<any> => {
    const auth = "Basic " + new Buffer(userId + ":" + apiKey).toString("base64");

    const response = await axios.post(`${url}/${api}`, data, {
        headers: {
            "authorization": auth,
            "Content-Type": 'application/json'
        }
    });

    return response
}
router.post('/planets', verifyToken, async (req, res) => {

    console.log(`Astronology  - get info`)
    try {
        const { chatId } = req.body.user

        const api = "planets"
        const data = req.body
        
        const astronologyData = await astronologyAPI(api, data)
        if( astronologyData?.status == 200 && astronologyData?.data != null) {
            res.status(200).json({
                state: true,
                data: astronologyData?.data,
            })
        }

    } catch (error) {
        res.status(500).end()
    }
})

export default router
