const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({

    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    status: { type: Boolean, default: 0 }
}, { timestamps: true })


module.exports = mongoose.model('User', userSchema, 'record')
