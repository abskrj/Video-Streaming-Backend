const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let VideoSchema = new Schema(
    {
        title: {
            type: String
        },
        slug: {
            type: String
        }

    },
    { collection: "VIDEO" }
);

module.exports = mongoose.model("VIDEO", VideoSchema);
