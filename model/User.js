const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    birthdate: Date,
    profileImage: {
        data: Buffer,
        contentType: String,
    },
},{timestamps: true});

module.exports = mongoose.model('User', UserSchema);