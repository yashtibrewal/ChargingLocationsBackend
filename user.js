/**
 * This file handles user authentication including signup and login
 */

const { Router } = require("express");
const jwt = require('jsonwebtoken');
const { getDB } = require("./database");
const bcrypt = require('bcrypt');

const loginRouter = new Router();

loginRouter.post("/signup", async (req, res) => {

    try {
        let { username, password } = req.body;

        const userCollection = getDB().collection('user');
        const existingUser = await userCollection.findOne({ username });
        if (existingUser) {
            throw new Error('User already exists');
        }
        password = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
        userCollection.insertOne({ username, password });
        const token = jwt.sign({ username }, process.env.PRIVATE_KEY);
        res.json({ token })

    } catch (error) {

        if (error.message === 'User already exists') {
            res.status(400).json({
                error: error.message,
                message: error.message
            })
        } else {
            res.status(400).json({
                error: error.message,
                message: "Invalid Details"
            })
        }
    }

})


loginRouter.get("/login", async (req, res) => {

    try {
        let { username, password } = req.body;

        const userCollection = getDB().collection('user');
        const existingUser = await userCollection.findOne({ username });
        if (!existingUser) {
            throw new Error("User doesn't exists");
        }
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if(isMatch) {
            const token = jwt.sign({ username }, process.env.PRIVATE_KEY);
            res.json({ token })
        }else {
            throw new Error("Password doesn't match");
        }
    } catch (error) {

        if (error.message === "User doesn't exists") {
            res.status(400).json({
                error: error.message,
                message: error.message
            })
        } else {
            res.status(400).json({
                error: error.message,
                message: "Invalid Details"
            })
        }
    }

})


module.exports = { loginRouter };