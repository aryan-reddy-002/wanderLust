if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const dburl = process.env.ATLASDB_URL

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/reviews.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter=  require("./routs/listing.js");
const reviewRouter=  require("./routs/reviews.js");
const userRouter = require("./routs/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
  mongoUrl : dburl,
  crypto : {
    secret : process.env.SECRET,
  },
  touchAfter : 24 * 3600,
});
store.on("error",(err)=>{
  console.log("ERROR in Mongo Session Store",err)
})

const sessionOptions = {
  store,
  secret :process.env.SECRET ,
    resave : false,
    saveUninitialized : true,
    cookie : { 
  expires :Date.now() + 7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    httpOnly : true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use((req,res,next)=>{
//   res.locals.success =  req.flash("success");
//   res.locals.error = req.flash("error");
//   res.locals.currentUser = req.user;
//   res.locals.currentUser = req.session.user || null;
//   console.log("the currUser" +res.locals.currentUser);
//   next();
// })

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;  
  console.log("Current user:", res.locals.currentUser);
  next();
});


main()
.then((err)=>{
    console.log("connection Established !!");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}

app.get("/", (req, res) => {
    res.redirect("/listings");
});


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found !!"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
//   res.status(status).send(message);
    res.status(status).render("./listings/error.ejs",{err});
});