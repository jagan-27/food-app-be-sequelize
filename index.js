const express = require('express')
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors')


const app = express()
app.use(cors())
app.use(express.json())

const sequelize = new Sequelize("postgresql://examplecreatepg_user:HUxzz2R4Cxr7qaVtZMO2nxOdkDe92L9l@dpg-cr4mp788fa8c73a4b6l0-a.singapore-postgres.render.com/examplecreatepg", {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true, // This will ensure SSL is used
        }
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./models/user')(sequelize, DataTypes);
db.Hotel = require('./models/hotel')(sequelize, DataTypes);

// app.post('/login', loginController)

app.get('/gethotels', async (req, res) => {
    try {
        const hotels = await db.Hotel.findAll();
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ error: error.message });
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