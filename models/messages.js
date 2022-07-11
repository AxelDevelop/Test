const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema({
    data:{
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: false,
    },
    date: {type: Date, default: Date.now},
});

const Msg = mongoose.model('msg', msgSchema)

module.exports = Msg;