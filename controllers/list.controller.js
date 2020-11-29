const db = require("../models");
const Video = db.video;
const User = db.user;


exports.listByParam = async (req, res) => {

    let start = parseInt(req.query.start) || 0;
    let limit = parseInt(req.query.limit) || 10;
    let sortBy = parseInt(req.query.sort) || 'score';
    let desc = parseInt(req.query.desc) || 1;

    if (desc) {
        sortBy = `-${sortBy}`;
    }

    let videos = await Video.find({}, '-score -updatedAt -likes -dislikes').skip(start).limit(limit).sort(sortBy).populate("owner", ["name", "avtarUrl", "profileSlug"]);

    res.send(videos);
}

exports.listByUser = async (req, res) => {

    let videos = await Video.find({owner: req.userId}, '-score -updatedAt -likes -dislikes').sort('createdAt').populate("owner", ["name", "avtarUrl", "profileSlug"]);

    res.send(videos);
}

exports.listByUserLikes = async (req, res) => {

    let videos = await User.find({_id: req.userId}, 'likedVideos').populate({path: "likedVideos", select: '-score -updatedAt -likes -dislikes', populate: {path: "owner", select: 'name avtarUrl profileSlug'} });

    res.send(videos[0].likedVideos);
}

exports.listByVideoId = async (req, res) => {

    let videos = await Video.findOne({videoId: req.query.vId}, '-score -updatedAt -likes -dislikes').populate("owner", ["name", "avtarUrl", "profileSlug"]);

    res.send(videos);
}