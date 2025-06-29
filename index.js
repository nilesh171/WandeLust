const Express = require('express')
let path= require('path');
let methodOverride = require('method-override');
let session = require('express-session');
const MongoStore = require('connect-mongo');
let flash = require('connect-flash');
let engine = require('ejs-mate');
let expressError = require('./utils/expressError.js');
let listings = require('./routes/listings.js');
let reviews = require('./routes/reviews.js')
let users = require('./routes/user.js');
let User = require('./models/user.js');
let passport = require('passport');
let LocalStrategy = require('passport-local');
const authRoutes = require('./routes/auth.js');
const dotenv = require('dotenv');
dotenv.config();
let app = Express();
let port = 5000;

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(Express.urlencoded({ extended: true }));
app.use(Express.static(path.join(__dirname, 'public')));    
app.use(methodOverride('_method'));
app.engine('ejs', engine);
require("./config/passport")(passport); 
let DBurl = process.env.MONGODB_URL;

let store = MongoStore.create({
  mongoUrl: DBurl,
  crypto:{
    secret : "mysupersecretstring",
  },
  touchAfter: 24*3600,
})

let sessionOptions = {
   store,
   secret : process.env.SECRET,
   resave : false,
   saveUninitialized : true,
   Cookie : {
    expires : Date.now() + 7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    httpOnly : true,
   },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});
app.use((req,res,next)=>{
   res.locals.successmsg = req.flash("success");
   res.locals.failuremsg = req.flash("failure");
   res.locals.errormsg = req.flash("error");
   res.locals.curruser = req.user;
   next();
});

app.use('/listings', listings);
app.use('/listings/:id/review', reviews);
app.use('/',users);
app.use('/auth', authRoutes);


app.listen(port,()=>{
     console.log("Server is running on port 8080");
})

// Catch-all route for undefined paths
app.all(/.*/, (req, res, next) => {
    next(new expressError(404, "Page Not Found !!!!"));
});

// Centralized error handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs", { error: message });
});






