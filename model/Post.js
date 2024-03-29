const mongoose = require('mongoose');
const User = require('./User');


const PostSchema = new mongoose.Schema({
    title: String,
    desc: String,
    images: [
        {
            data: Buffer,
            contentType: String
        }
    ],
    author: String,
    likes: {type: Number, default: 0}
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);