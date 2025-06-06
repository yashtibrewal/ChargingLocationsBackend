require('dotenv').config();

const express = require('express');
const { connectDb } = require('./database');
const { loginRouter } = require('./user');
const chargingRouter = require('./chargingLocation');
const cors = require('cors');
const app = express();
const port = process.env.PORT;

app.use(cors())

// Middleware to parse JSON
app.use(express.json());

// Connect db
connectDb().then(()=>{

    // Basic route
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.use(loginRouter);
    app.use('/charging-locations', chargingRouter)

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

});

