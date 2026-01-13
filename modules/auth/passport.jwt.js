const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../../models/user.model");
const jwtConfig = require("../../config/jwt");


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtConfig.secret
};

passport.use(
    new JwtStrategy(
        opts, async (payload, done) => {
            try {
                const user = await User.findById(payload.id);
                if (!user || !user.isActive) {
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);
