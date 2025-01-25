import express from 'express'
import dotenv from 'dotenv'
import axios from 'axios'
import { verifyToken } from '../middleware'
import { UserModel } from '../models/user.model'

dotenv.config()
interface PlanetData {
    name: string;
    fullDegree: number;
    normDegree: number;
    speed: number;
    isRetro: string;
    sign: string;
    house: number;
}

const router = express.Router()

const url = `https://json.astrologyapi.com/v1`
const userId = process.env.ASTROLOGY_USER_ID;
const apiKey = process.env.ASTROLOGY_API_KEY;

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

const updateZodiac = async (chatId: string, fields: string[], values: any[]): Promise<any> => {

    if (fields.length !== values.length) {
        throw new Error('Fields and values arrays must have the same length');
    }
    const update: { [key: string]: any } = {};
    fields.forEach((field, index) => {
        update[`zodiac.${field}`] = values[index];
    });

    try {
        const options = { new: true }; // Return the updated document
        const updatedUser = await UserModel.findOneAndUpdate({ chatId }, { $set: update }, options);

        if (updatedUser) {
            // console.log('User updated successfully:', updatedUser);
        } else {
            console.log('User not found');
        }
    } catch (error) {
        console.error('Error updating user:', error);
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
    console.log(`Astronology  - planets`)
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
    console.log(`Astronology  - get details`)
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
    console.log(`Astronology  - get planets tropical`)
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

            // console.log(">>>> Tropical Data >>>>", planetData.data)

            if (planetData.data != null) {
                const sunData = planetData.data.find(
                    (planet: PlanetData) => planet.name === "Sun"
                );
                const moonData = planetData.data.find(
                    (planet: PlanetData) => planet.name === "Moon"
                );
                const risingData = planetData.data.find(
                    (planet: PlanetData) => planet.name === "Ascendant"
                );

                updateZodiac(chatId, ['sunSign', 'moonSign', 'risingSign'], [sunData.sign, moonData.sign, risingData.sign])
            }
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
    console.log(`Astronology  - get natal_chart_interpretation`)
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

        const luckyData = await astronologyAPI(api, data)

        if (luckyData?.status == 200 && luckyData.data != null) {
            if (luckyData.data && luckyData.data.destiny_number != null) {
                updateZodiac(chatId, ['luckyNo'], [luckyData.data.destiny_number])
            }

            res.status(200).json({
                state: true,
                data: luckyData?.data,
            })
        }

    } catch (error) {
        res.status(500).end()
    }
});

router.post('/chinese_zodiac', verifyToken, async (req, res) => {
    console.log(`Astronology  - get chinese_zodiac`)
    try {
        const { chatId } = req.body.user

        const api = "chinese_zodiac"
        const data =
        {
            day: req.body.day,
            month: req.body.month,
            year: req.body.year
        }

        const chineseZodiac = await astronologyAPI(api, data)

        if (chineseZodiac?.status == 200 && chineseZodiac?.data != null) {
            if (chineseZodiac.data && chineseZodiac.data.name != null) {
                updateZodiac(chatId, ['chineseZodiac'], [chineseZodiac.data.name])
            }

            res.status(200).json({
                state: true,
                data: chineseZodiac?.data,
            })
        }

    } catch (error) {
        res.status(500).end()
    }
});

router.post('/sun_sign_prediction/daily', verifyToken, async (req, res) => {
    console.log(`Astronology  - get sun_sign_prediction/daily`)

    try {
        const { chatId } = req.body.user

        const zodiac = req.body.zodiac
        const api = `sun_sign_prediction/daily/${zodiac.toLowerCase()}`
        const planetData = await astronologyAPIBeta(api, {})

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

export default router
