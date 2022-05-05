const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const room = new Schema({
    userJob: {type : String, required : true},
    roomID: { type : String, require : true, unique : true},
    userName1: { type: String, require : true, default : 'anonymous'},
    userName2: { type: String},
    userID1: {type : String, require : true, unique : true, default : ''},
    userID2: {type : String, require : true, unique : true, default : ''},
    userCount: {
        type : Number,
        require : true,
        default : 0, 
        min : 0,
        max : 2
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('room', room);