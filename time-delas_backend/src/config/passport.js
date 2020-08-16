const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const jwtConfig = require("./jwt");

const User = require("../models/User");

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.publicKey,
      algorithms: ["RS256"],
    },

    function (jwt_payload, done) {
      User.findById(jwt_payload.sub)
        .then((user) => {
          if (!user) return done(null, false, { message: "User not found." });

          return done(null, user);
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);

module.exports = passport;
