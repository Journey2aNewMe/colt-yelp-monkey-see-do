const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,       //these 3 lines are included in the tutorial. But mongoose documentation allows that these may be removed
    // useCreateIndex: true,     // these line causes error in the DB connection.
    useUnifiedTopology: true     
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error (me mali):"));
db.once("open", () => {
    console.log("Database Connected")
})


const seedDB = async() => {
    await Campground.deleteMany({});
    
    for (let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground ({
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        })
        await camp.save();
    }

}

seedDB();