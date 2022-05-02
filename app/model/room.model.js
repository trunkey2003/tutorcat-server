const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const room = new Schema({
    userID: { type: String, require : true, default : ''},
    roomID: { type : String, require : true, unique : true},
    userCount: {type : Number, require : true, default : 1},
},
{
    timestamps: true
});

module.exports = mongoose.model('room', room);