import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'
import { verifyToken } from '../middleware'

dotenv.config()

const router = express.Router()

const url = `https://json.astrologyapi.com/v1`
const userId = '636619';
const apiKey = '0501987722bcfc291ab3988223d2a0b49028af65';

const astronologyAPI = async (api: string, data: any): Promise<any> => {
    const auth = "Basic " + new Buffer(userId + ":" + apiKey).toString("base64");

    console.log("Start astronologyAPI ")
    try {
        const response = await axios.post(`${url}/${api}`, data, {
            headers: {
                "authorization": auth,
                "Content-Type": 'application/json'
            }
        });
        console.log("END astronologyAPI ")

        return response
    } catch (err) {
        console.log(err)
    }
}
router.post('/planets', verifyToken, async (req, res) => {

    console.log(`Astronology  - get info`)
    try {
        const { chatId } = req.body.user

        const api = "planets"
        const data = req.body

        const astronologyData = await astronologyAPI(api, data)
        if (astronologyData?.status == 200 && astronologyData?.data != null) {
            res.status(200).json({
                state: true,
                data: astronologyData?.data,
            })
        }

    } catch (error) {
        res.status(500).end()
    }
})

router.post('/get_details', verifyToken, async (req, res) => {
    console.log(`/get_details`)
    try {
        const { chatId } = req.body.user

        const api = "geo_details"
        const data =
        {
            place: req.body.place,
            maxRows: req.body.maxRows
        }

        console.log(`get_detail - data: `, data)
        const astronologyData = await astronologyAPI(api, data)
        console.log(`get_detail - result: `, astronologyData)

        if (astronologyData?.status == 200 && astronologyData?.data != null) {
            res.status(200).json({
                state: true,
                data: astronologyData?.data,
            })
        }

    } catch (error) {
        res.status(500).end()
    }
})

router.post('/planets/tropical', verifyToken, async (req, res) => {
    console.log(`Astronology  - get planets`)
    try {
        const { chatId } = req.body.user

        const api = "planets/tropical"
        console.log("==================Data: ", req.body)
        const data =
        {
            day: req.body.day,
            month: req.body.month,
            year: req.body.year,
            hour: req.body.hour,
            min: req.body.min,
            lat: req.body.lat,
            lon: req.body.lon,
            tzone: req.body.tzone
        }

        const planetData = await astronologyAPI(api, data)

        if (planetData?.status == 200 && planetData?.data != null) {
            console.log("Planet Data >>>>", planetData.data)
            res.status(200).json({
                state: true,
                data: planetData?.data,
            })
        }

    } catch (error) {
        res.status(500).end()
    }

})

export default router
