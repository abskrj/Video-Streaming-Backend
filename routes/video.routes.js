const controller = require('../controllers/video.controller');
const { authJwt, videoMiddlewares } = require('../middlewares');
const path = require('path');

const options = {
    useFoldersForFileTypes: false,
    useIAMRoleCredentials: false
}

module.exports = function (app) {
    app.use( async (req, res, next)=> {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/video/upload", [authJwt.verifyToken, videoMiddlewares.addVideoId], controller.videoUpload);

    app.post("/api/video/register", [authJwt.verifyToken], controller.videoRegister);
};

