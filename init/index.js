const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//DataBase Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
    console.log("Connected to MongoDB");
    })
    .catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}


const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "67ef8d5cd72754823ccf8f84"}));
    await Listing.insertMany(initData.data);
    console.log("Okay");

}

initDB();