const mongoose = require('mongoose');


const ProjectSchema = new mongoose.Schema({
    title: String,
    desc: String,
    images: [
        {
            data: Buffer,
            contentType: String
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);