const express = require('express')
const { Sequelize, DataTypes, where } = require('sequelize');
const cors = require('cors');
const initModels = require('./model/init-models');
const config = require('./config'); 


const app = express()
app.use(cors())
app.use(express.json())

const sequelize = new Sequelize(config.dbname, config.user, config.pass, config.autoOptions);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

const models = initModels(sequelize);
db.User = models.userTable;
db.Hotel = models.hotelTable;

// db.User = require('./models/user')(sequelize, DataTypes);
// db.Hotel = require('./models/hotel')(sequelize, DataTypes);

app.post('/login', async (req, res) => {
    try {
        const { userMobileNumber, userName, userType, userPassword } = req.body;
        const user = await db.User.findOne({ where: { userMobileNumber, userName, userType, userPassword } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error, "error in login")
        res.status(500).json({ error: "error in login" });
    }
})

app.get('/gethotels', async (req, res) => {
    try {
        const hotels = await db.Hotel.findAll();
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.post('/createhotel', async (req, res) => {
    try {
        const hotel = req.body;
        const result = await db.Hotel.create({ ...hotel });
        res.status(200).json(result);
    } catch (error) {
        console.log(error, "error in createhotel")
        res.status(500).json({ error: "error in createhotel" });
    }
})

// app.delete('/bike/:id', deleteBike)

app.listen(3001, () => {
    console.log('listening 3001 port')
    db.sequelize.sync({ force: false }).then(() => {
        console.log('Database synchronized');
    }).catch(err => {
        console.error('Unable to connect to the database:', err);
    });
})