const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
let gravatar = require("gravatar-api");
const StrGen = require("@supercharge/strings");
const slug = require("slug");

exports.signup = (req, res) => {

    let avtarUrl = gravatar.imageUrl({ email: req.body.email, secure: true });

    profileSlug = slug(StrGen.random(8), {lower: false});

    const user = new User({
        userId: StrGen.random(6),
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        avtarUrl: `${avtarUrl}?default=wavatar`,
        profileSlug: profileSlug
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        else {
            res.send({ message: "User was registered successfully!" });
        }
    });
};

exports.signin = (req, res) => {
    User.findOne({
        username: req.body.username,
    })
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!",
                });
            }


            var token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
                expiresIn: 604800, // 24 hours
            });

            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                avtarUrl: user.avtarUrl,
                accessToken: token,
            });
        });
};

exports.tokenVerified = (req, res) => {
    res.send({message: 'Token Verified'});
}
