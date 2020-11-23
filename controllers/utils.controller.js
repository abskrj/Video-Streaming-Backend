const { video } = require("../models");
const db = require("../models");
const Video = db.video;
const User = db.user;

exports.videoLike = async (req, res) => {

    res.send({ message: 'ok' });

    User.findOne({ _id: req.userId })
        .then((doc) => {
            if (doc.likedVideos.indexOf(req.params.videoId) > -1) {
                console.log("Already Liked")
                return;
            }
            else {
                let disliked = false;
                const dislikeIndex = doc.dislikedVideos.indexOf(req.params.videoId);

                if (dislikeIndex > -1) {
                    disliked = true;
                    doc.dislikedVideos.splice(dislikeIndex, 1);
                }
                doc.likedVideos.push(req.params.videoId);
                doc.save()
                Video.findOne({ _id: req.params.videoId })
                    .then((docVid) => {
                        docVid.likes = docVid.likes + 1;

                        if (disliked) {
                            docVid.dislikes = docVid.dislikes - 1;
                        }
                        docVid.save();
                        console.log('Video Liked')
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        })
        .catch((err) => {
            console.error(err);
        })
}

exports.videoDislike = async (req, res) => {

    res.send({ message: 'ok' });

    User.findOne({ _id: req.userId })
        .then((doc) => {
            if (doc.dislikedVideos.indexOf(req.params.videoId) > -1) {
                console.log("Already Disliked")
                return;
            }
            else {
                let liked = false;
                const likeIndex = doc.likedVideos.indexOf(req.params.videoId);

                if (likeIndex > -1) {
                    liked = true;
                    doc.likedVideos.splice(likeIndex, 1);
                }
                doc.dislikedVideos.push(req.params.videoId);
                doc.save()
                Video.findOne({ _id: req.params.videoId })
                    .then((docVid) => {
                        docVid.dislikes = docVid.dislikes + 1;

                        if (liked) {
                            docVid.likes = docVid.likes - 1;
                        }
                        docVid.save();
                        console.log('Video Disliked')
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        })
        .catch((err) => {
            console.error(err);
        })
}

exports.videoView = async (req, res) => {

    res.send({ message: 'ok' });

    User.findOne({ _id: req.userId })
        .then((doc) => {
            if (doc.viewedVideos.indexOf(req.params.videoId) > -1) {
                Video.findOne({ _id: req.params.videoId })
                    .then((docVid) => {
                        docVid.views = docVid.views + 1;
                        docVid.save();
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
            else {
                doc.viewedVideos.push(req.params.videoId);
                doc.save()
                Video.findOne({ _id: req.params.videoId })
                    .then((docVid) => {
                        docVid.views = docVid.views + 1;
                        docVid.save();
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        })
        .catch((err) => {
            console.error(err);
        })
        console.log('Video Viewed');
}

exports.searchByQuery = async (req, res) => {

    console.log(req.query.q);

    let videos = await Video.find({ '$or': [{'title' : { $regex: req.query.q, $options: 'i' }}, {'description' : { $regex: req.query.q, $options: 'i' }}, {'category' : { $regex: req.query.q, $options: 'i' }}, {'tags' : { $regex: req.query.q, $options: 'i' }}]}, '-score -updatedAt -likes -dislikes').sort('score').populate("owner", ["name", "avtarUrl", "profileSlug"]);

    res.send(videos);
}