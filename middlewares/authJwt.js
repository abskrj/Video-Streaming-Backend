const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const Role = db.role;

const secret_key = process.env.SECRET_KEY;

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, secret_key, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        else {
            if (!user.isAdmin) {
                res.status(403).send({ message: "Require Admin Access!" });
                return;
            }
        }
        next();
    });
};

isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        else {
            if (!user.isModerator) {
                res.status(403).send({ message: "Require Moderator Access!" });
                return;
            }
        }
        next();
    });
};

isStaff = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        else {
            if (!user.isModerator || !user.isAdmin) {
                res.status(403).send({ message: "Require Staff Access!" });
                return;
            }
        }
        next();
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
    isStaff
};
module.exports = authJwt;