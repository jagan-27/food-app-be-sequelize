const express = require('express')
const { Sequelize, DataTypes, where, Op, fn, col } = require('sequelize');
const cors = require('cors');
const initModels = require('./models/init-models');
const config = require('./config');
// Get the current date as a string in 'YYYY-MM-DD' format
const currentDateOnly = new Date().toISOString().split('T')[0];


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
        } else {
            if (user?.dataValues?.isActive) {
                res.status(200).json({ success: true });
            } else {
                res.status(200).json({ success: false, error: 'Please check with admin' });
            }
        }
    } catch (error) {
        console.log(error, "error in login")
        res.status(500).json({ error: "error in login" });
    }
})

app.get('/count/:userMobileNumber', async (req, res) => {
    try {
        const userMobileNumber = req.params.userMobileNumber;
        const hotels = await db.Hotel.count({ where: { userMobileNumber } });
        console.log("Entering Daily Count");
        const dailyCount = await db.Hotel.count({ 
            where: {
                userMobileNumber,
                [Op.and]: [
                  Sequelize.where(fn('DATE', col('created_date')), currentDateOnly) // Proper use of Sequelize's functions
                ]
            }
        });
        console.log("DailyCount = " + dailyCount);
        const verifiedHotel = await db.Hotel.count({ where: { userMobileNumber, valid: true } });
        console.log("Valid Count = "+ verifiedHotel);
        res.status(200).json({ 
            allCount: hotels, 
            verifiedCount: verifiedHotel,
            dailyCount: dailyCount
        });
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
            where: { hotelVlogVideoLink: hotel.hotelVlogVideoLink }, defaults: {
                userMobileNumber: hotel.userMobileNumber,
                hotelName: hotel.hotelName,
                hotelAddress: hotel.hotelAddress,
                hotelCity: hotel.hotelCity,
                hotelRating: hotel.hotelRating,
                hotelPhone: hotel.hotelPhone,
                hotelMapLocationLink: hotel.hotelMapLocationLink,
                vlogVideoViewCount: hotel.vlogVideoViewCount,
                vlogPostDate: hotel.vlogPostDate,
                hotelVlogVideoLink: hotel.hotelVlogVideoLink
            }
        });
        if (created) {
            return res.status(201).json(result);
        }
        return res.status(208).json({ success: false });
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
