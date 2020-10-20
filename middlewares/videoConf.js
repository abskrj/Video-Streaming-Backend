const strGen = require('@supercharge/strings');
var slug = require('slug');

addVideoId = (req, res, next) => {
    req.videoId = slug(strGen.random(9), {lower: false});
    next();
}

const videoMiddlewares = {
    addVideoId,
}

module.exports = videoMiddlewares;