const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
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

//allows for form data passing to route
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home')
})


app.get('/campgrounds', async(req, res) => {
    const campgrounds = await Campground.find()
    res.render('campgrounds/index', { campgrounds }); 
})


//this route goes first before the route: '/campground/:id' as the
//word "new" in this route is being treated as id. So order or 
//route matters
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})


//this route is called from new form {with method POST)
app.post('/campgrounds', async(req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})


app.get('/campgrounds/:id', async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground })
})


app.get('/campgrounds/:id/edit', async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
})


app.put('/campgrounds/:id', async(req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`)  
})



app.delete('/campgrounds/:id', async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})


app.listen(3000, () => {
    console.log("Serving on port 3000")
})

