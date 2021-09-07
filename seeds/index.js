const mongoose = require("mongoose");
const cities = require("./cities");
const {places, descriptor} = require("./seedHelper");
const Landmark = require("../models/landmark");

mongoose.connect("mongodb://localhost:27017/sanatana",{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("DB connected");
});

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length )];
}

const seedDB = async () => {
    await Landmark.deleteMany({});
    for(let i=0;i<50;i++){
        const random100 = Math.floor(Math.random()*100);
        const newLandmark = new Landmark({
            title: `${sample(descriptor)} ${sample(places)}`,
            location: `${cities[random100].city}, ${cities[random100].admin_name}`
        });
        await newLandmark.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
})