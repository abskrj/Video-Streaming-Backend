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
            type: Schema.Types.ObjectId,
            ref: "CATEGORY"
        },
        videoId: {
            type: String,
            unique: true,
            required: true
        },
        videoUrl: {
            type: String
        },
        createdAt: {
            type: Date
        },
        isActive: {
            type: Boolean,
            default: true
        },
        thumbnailUrl: {
            type: String,
        },
        likes: {
            type: Number
        },
        dislikes: {
            type: Number
        },
        views: {
            type: Number
        }        
        

    },
    { collection: "VIDEO" }
);

module.exports = mongoose.model("VIDEO", VideoSchema);
