const controller = require("../controllers/utils.controller");
const { authJwt } = require("../middlewares");


module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/video/like/:videoId", authJwt.verifyToken, controller.videoLike);
    app.get("/api/video/dislike/:videoId", authJwt.verifyToken, controller.videoDislike);
    app.get("/api/video/view/:videoId", authJwt.verifyToken, controller.videoView);
    app.get("/api/video/search", authJwt.verifyToken, controller.searchByQuery);
};