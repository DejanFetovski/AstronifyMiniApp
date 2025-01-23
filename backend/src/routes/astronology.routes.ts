import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'
import { verifyToken } from '../middleware'

dotenv.config()

const router = express.Router()

const url = `https://json.astrologyapi.com/v1`
const userId = '633754';
const apiKey = '4a83d366b861f26551db7af1cb94325b934bd46b';

const astronologyAPI = async (api: string, data: any): Promise<any> => {
    const auth = "Basic " + new Buffer(userId + ":" + apiKey).toString("base64");

    try {
        const response = await axios.post(`${url}/${api}`, data, {
            headers: {
                "authorization": auth,
                "Content-Type": 'application/json'
            }
        });

        return response
    } catch (err) {
        console.log(err)
    }
}

const astronologyAPIBeta = async (api: string, data: any): Promise<any> => {
    const auth = "Basic " + new Buffer('636621' + ":" + '3a63ff9cba04b896d42914d96912b54d1e26ab9f').toString("base64");

    try {
        const response = await axios.post(`${url}/${api}`, data, {
            headers: {
                "authorization": auth,
                "Content-Type": 'application/json'
            }
        });

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

router.post('/planets/tropical', verifyToken, async (req, res) => {
    console.log(`Astronology  - get planets`)
    try {
        const { chatId } = req.body.user

        const api = "planets/tropical"
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
            res.status(200).json({
                state: true,
                data: planetData?.data,
            })
        }

    } catch (error) {
        res.status(500).end()
    }

})

router.post('/natal_chart_interpretation', verifyToken, async (req, res) => {
    console.log(`Astronology  - get planets`)
    try {
        const { chatId } = req.body.user

        const api = "natal_chart_interpretation"
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
            res.status(200).json({
                state: true,
                data: planetData?.data,
            })
        }

    } catch (error) {
        res.status(500).end()
    }
});

router.post('/numero_table', verifyToken, async (req, res) => {
    console.log(`Astronology  - get Lucky Number`)
    try {
        const { chatId } = req.body.user

        const api = "numero_table"
        const data =
        {
            day: req.body.day,
            month: req.body.month,
            year: req.body.year,
            name: req.body.name
        }

        const planetData = await astronologyAPI(api, data)

        if (planetData?.status == 200 && planetData?.data != null) {
            res.status(200).json({
                state: true,
                data: planetData?.data,
            })
        }

    } catch (error) {
        res.status(500).end()
    }
});

router.post('/chinese_zodiac', verifyToken, async (req, res) => {
    try {
        const { chatId } = req.body.user

        const api = "chinese_zodiac"
        const data =
        {
            day: req.body.day,
            month: req.body.month,
            year: req.body.year
        }

        const planetData = await astronologyAPI(api, data)

        if (planetData?.status == 200 && planetData?.data != null) {
            res.status(200).json({
                state: true,
                data: planetData?.data,
            })
        }

    } catch (error) {
        res.status(500).end()
    }
});


router.post('/sun_sign_prediction/daily', verifyToken, async (req, res) => {
    try {
        const { chatId } = req.body.user

        const zodiac = req.body.zodiac
        const api = `sun_sign_prediction/daily/${zodiac.toLowerCase()}`
        console.log("sun_sign_prediction - API >>>>", api)
        const planetData = await astronologyAPIBeta(api, {})

        if (planetData?.status == 200 && planetData?.data != null) {
            console.log("sun_sign_prediction/daily >>>>", planetData.data)

            res.status(200).json({
                state: true,
                data: planetData?.data,
            })
        }

    } catch (error) {
        res.status(500).end()
    }
});
export default router
