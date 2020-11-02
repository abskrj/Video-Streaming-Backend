const { verifyRegister, authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get('/api/auth/jwt/verify', [authJwt.verifyToken], controller.tokenVerified)

    app.post("/api/auth/signup", [verifyRegister], controller.signup);

    app.post("/api/auth/signin", controller.signin);
};
