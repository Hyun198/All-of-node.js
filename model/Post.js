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
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);