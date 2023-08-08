const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    birthdate: Date,
    profileImage: {
        data: Buffer,
        contentType: String,
    },
});

module.exports = mongoose.model('User', UserSchema);