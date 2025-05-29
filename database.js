const { MongoClient } = require("mongodb")


const mongodb_uri = process.env.MONGODB_URI;
const client = new MongoClient(mongodb_uri);

let db;

const connectDb = async () => {

    try{
        await client.connect();
        db = client.db('ChargingLocations');
        console.log("Mongodb Connected")
    } catch (err) {
        console.log("Connection not successful");
        console.log(err);
        process.exit(1);
    }
}

function getDB() {
    if(!db){
        throw new Error('Connection not successful')
    }
    return db;
}

module.exports = {
    connectDb,
    getDB
}