const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const { places, descriptors } = require ('./seedHelpers');

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


const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async() => {
    await Campground.deleteMany({});
    
    for (let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 + 10);
        const camp = new Campground ({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            // image:   'https://source.unsplash.com/collection/1114848',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis similique atque incidunt cumque commodi omnis excepturi iusto recusandae voluptate. Totam minus repudiandae asperiores consectetur! Quod, in? Accusamus est suscipit maxime enim. Minus ex consequatur itaque tempore totam, provident quis aspernatur quisquam sunt veniam deserunt amet.',
            price
        })
        await camp.save();
    }

}



seedDB().then(() => {
    mongoose.connection.close();
})