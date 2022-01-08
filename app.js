const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

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


const app = express();



app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.get('/', (req, res) => {
    //go to home.ejs
    res.render('home')
})


app.get('/makecampground', async (req, res) => {
    const camp = new Campground({ title: 'My Background', description: "Cheap camping"})
    await camp.save();
    res.send(camp)
})



app.listen(3000, () => {
    console.log("Serving on port 3000")
})

