const controller = require("../controllers/list.controller");
const { authJwt } = require("../middlewares");


module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/list/videos", controller.listByParam);
    app.get("/api/list/myvideos", authJwt.verifyToken ,controller.listByUser);
    app.get("/api/list/mylikes", authJwt.verifyToken ,controller.listByUserLikes);
    app.get("/api/list/this", authJwt.verifyToken ,controller.listByVideoId);
};