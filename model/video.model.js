const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    video: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Video', videoSchema, 'video')