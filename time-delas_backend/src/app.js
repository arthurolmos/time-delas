const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("./config/passport");
const passportAuth = require("./middlewares/passportAuth");
const { errors } = require("celebrate");
const routes = require("./routes");
const morgan = require("morgan");

const dotenv = require("dotenv").config({
  path: process.env.NODE_ENV === "prod" ? ".env.prod" : ".env.dev",
});
console.log(dotenv);
// require('./config/redis')

const app = express();

// app.use(cors())
app.use(express.json());
app.use(
  "/pictures",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);
// app.use(express.static(path.resolve(__dirname, '..', 'public')))
app.use(passport.initialize());
// app.use(
//   passportAuth.unless({
//     path: ["/signin", "/register"],
//   })
// );
app.use(morgan("dev"));
app.use(routes);
// app.use(function(err, req, res, next) {
//     console.log('IM HERE')
//     if(err) {
//         console.log('ERROR', err)
//     }
// })

module.exports = app;
