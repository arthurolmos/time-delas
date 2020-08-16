const passport = require("../config/passport");
const unless = require("express-unless");

const auth = passport.authenticate("jwt", { session: false });
auth.unless = unless;

module.exports = auth;
