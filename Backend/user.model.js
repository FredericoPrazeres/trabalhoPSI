const Item = require("./item.model");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        required: false,
    },
    library: {
        type: [String],
        required: false,
    },
    wishList: {
        type: [String],
        required: false,
    },
    customLists: {
        type: [String],
        required: false,
    },
    followingLists: {
        type: [String],
        required:false
    },
    followerLists: {
        type: [String],
        required:false
    },
});

module.exports = mongoose.model("User", userSchema);