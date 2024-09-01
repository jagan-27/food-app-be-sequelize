const express = require('express')
const { Sequelize, DataTypes, where } = require('sequelize');
const cors = require('cors');
const initModels = require('./models/init-models');
const config = require('./config');


const app = express()
app.use(cors())
app.use(express.json())

const sequelize = new Sequelize(config.dbname, config.user, config.pass, config.autoOptions);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

const models = initModels(sequelize);
db.User = models.user;
db.Hotel = models.hotel;
db.HotelSignatureDish = models.hotelSignatureDish;
db.HotelTiming = models.hotelTiming;

app.post('/login', async (req, res) => {
    try {
        const { userMobileNumber } = req.body;
        const user = await db.User.findOne({ where: { userMobileNumber } });
        if (!user) {
            return res.status(204).json({ error: 'User not found' });
        }
        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error, "error in login")
        res.status(500).json({ error: "error in login" });
    }
})

app.get('/count/:userMobileNumber', async (req, res) => {
    try {
        const userMobileNumber = req.params.userMobileNumber;
        const hotels = await db.Hotel.count({ where: { userMobileNumber } });
        const verifiedHotel = await db.Hotel.count({ where: { verified: true } });
        console.log(hotels, "hotelshotels")
        res.status(200).json({ allCount: hotels, verifiedCount: verifiedHotel });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get('/gethotels', async (req, res) => {
    try {
        const hotels = await db.Hotel.findAll();
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.post('/createhotel', async (req, res) => {
    try {
        const hotel = req.body;
        const [result, created] = await db.Hotel.findOrCreate({
            where: { hotelVlogVideoLink: hotel.hotelVlogVideoLink }, default: {
                userMobileNumber: hotel.userMobileNumber,
                hotelName: hotel.hotelName,
                hotelAddress: hotel.hotelAddress,
                hotelCity: hotel.hotelCity,
                hotelRating: hotel.hotelRating,
                hotelPhone: hotel.hotelPhone,
                hotelMapLocationLink: hotel.hotelMapLocationLink,
                vlogVideoViewCount: hotel.vlogVideoViewCount,
                vlogPostDate: hotel.vlogPostDate,
                verified: hotel.verified,
                isActive: hotel.isActive,
                createdDate: hotel.createdDate,
                modifiedDate: hotel.modifiedDate
            }
        });
        if (created) {
            return res.status(201).json(result);
        }
        return res.status(200).json({ success: false });
    } catch (error) {
        console.log(error, "error in createhotel")
        res.status(500).json({ error: "error in createhotel" });
    }
})

app.post('/hotel/:id', async (req, res) => {
    try {
        const hotelId = req.params.id;
        const [updated] = await hotel.update(req.body, {
            where: { hotelId }
        });
        if (updated) {
            const updatedHotel = await hotel.findByPk(hotelId);
            res.json(updatedHotel);
        } else {
            res.status(204).json({ error: 'Hotel not found' });
        }
    } catch (error) {
        console.error('Error updating hotel:', error);
        res.status(500).json({ error: 'Error updating hotel' });
    }
});


app.post('/dish', async (req, res) => {
    try {
        const newDish = await db.HotelSignatureDish.create(req.body);
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/timing', async (req, res) => {
    try {
        const newTiming = await db.HotelTiming.create(req.body);
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log('listening 3001 port')
    db.sequelize.sync({ force: false }).then(() => {
        console.log('Database synchronized');
    }).catch(err => {
        console.error('Unable to connect to the database:', err);
    });
})