const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema } = require('./schemas.js')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
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


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//allows for form data passing to route
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));




const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}





app.get('/', (req, res) => {
    res.render('home')
})


app.get('/campgrounds', catchAsync(async(req, res) => {
    const campgrounds = await Campground.find()
    res.render('campgrounds/index', { campgrounds }); 
}))


//this route goes first before the route: '/campground/:id' as the
//word "new" in this route is being treated as id. So order or 
//route matters
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
});


//this route is called from new form {with method POST)
app.post('/campgrounds', validateCampground, catchAsync(async(req, res, next) => {
        // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);

        const campground = new Campground(req.body.campground);
        await campground.save()
        res.redirect(`/campgrounds/${campground._id}`)

}));


app.get('/campgrounds/:id', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground })
}));


app.get('/campgrounds/:id/edit', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
}));


app.put('/campgrounds/:id', validateCampground, catchAsync(async(req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`)  
}));



app.delete('/campgrounds/:id', catchAsync(async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong'} = err;
    if (!err.message) err.message = "Oh no, something went wrong!"
    res.status(statusCode).render('error', {err});
})


app.listen(3000, () => {
    console.log("Serving on port 3000")
})

