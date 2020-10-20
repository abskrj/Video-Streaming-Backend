const { Str } = require("@supercharge/strings/dist/str");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let UserSchema = new Schema(
    {
        name: {
            type: String,
        },
        userId: {
            type: String,
            unique: true,
            required: true
        },
        username: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        profileSlug: {
            type: String,
            unique: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isModerator: {
            type: Boolean,
            default: false
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email address",
            ],
        },
        avtarUrl: {
            type: String,
        },
        video: [
            {
                type: Schema.Types.ObjectId,
                ref: "VIDEO",
            },
        ],
        searches: [
            {
                type:String
            }
        ],
        likedVideos: [
            {
                type: Schema.Types.ObjectId,
                ref: "VIDEO",
            }
        ],
        dislikedVideos: [
            {
                type: Schema.Types.ObjectId,
                ref: "VIDEO",
            }
        ],
        viewedVideos: [
            {
                type: Schema.Types.ObjectId,
                ref: "VIDEO",
            }
        ]

    },
    { collection: "USER" }
);

module.exports = mongoose.model("USER", UserSchema);
