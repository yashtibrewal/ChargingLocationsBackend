const jwt = require('jsonwebtoken');
const { getDB } = require('./database');
const { Router } = require('express');
const { ObjectId } = require('mongodb');

const chargingRouter = new Router();

const chargingPoints = 'chargingPoints';

const authMiddleware = async (req, res, next) => {

    // Bearer token
    const token = req.headers.authorization?.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        req.user = decoded;
        next();
    } catch (err) {

        res.status(401).json({
            error: err.message,
            message: 'Unauthorized'
        })

    }
}

chargingRouter.get("/", authMiddleware, async (req, res) => {

    try {

        const charging_points_locations = await getDB().collection(chargingPoints).find({}).toArray();
        res.json({
            data: charging_points_locations
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({
            error: err.message,
            message: 'Something went wrong'
        })

    }

});


chargingRouter.post("/", authMiddleware, async (req, res) => {

    try {

        const { name, location, status, power_output, connector_type } = req.body;
        const result = await getDB().collection(chargingPoints).insertOne({
            name, location, status, power_output, connector_type
        })
        res.status(200).json({
            result
        })

    } catch (err) {

        res.status(400).json({
            error: err.message,
            message: 'Something went wrong'
        })

    }

});


chargingRouter.patch("/", authMiddleware, async (req, res) => {

    try {

        const { _id, name, location, status, power_output, connector_type } = req.body;

        if (!ObjectId.isValid(_id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        const result = await getDB().collection(chargingPoints).updateOne({
            _id: new ObjectId(String(_id))
        }, {
            $set:{
                name, location, status, power_output, connector_type
            }
        })
        res.status(200).json({
            result
        })

    } catch (err) {

        res.status(400).json({
            error: err.message,
            message: 'Something went wrong'
        })

    }

});


chargingRouter.delete("/", authMiddleware, async (req, res) => {

    try {

        const { _id } = req.body;

        if (!ObjectId.isValid(_id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        const result = await getDB().collection(chargingPoints).deleteOne({
            _id: new ObjectId(String(_id))
        })
        res.status(200).json({
            result
        })

    } catch (err) {

        res.status(400).json({
            error: err.message,
            message: 'Something went wrong'
        })

    }

});

module.exports = chargingRouter;