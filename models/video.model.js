const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let VideoSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "USER"
        },
        title: {
            type: String
        },
        description: {
            type: String
        },
        tags: [
            {
                type:String
            }
        ],
        category: {
            type: String
        },
        videoId: {
            type: String,
            unique: true,
            required: true
        },
        videoUrl: {
            type: String
        },
        isActive: {
            type: Boolean,
            default: true
        },
        thumbnailUrl: {
            type: String,
        },
        likes: {
            type: Number,
            default: 0
        },
        dislikes: {
            type: Number,
            default: 0
        },
        views: {
            type: Number,
            default: 0
        },
        score: {
            type: Number,
            default: 0
        }
    },
    { collection: "VIDEO", timestamps: true }
);

module.exports = mongoose.model("VIDEO", VideoSchema);
