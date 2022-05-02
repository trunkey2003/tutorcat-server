var express = require('express');
const { route } = require('express/lib/application');
var router = express.Router();

const roomController = require('../app/controller/room.controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//room
router.get('/api/room/get/:roomID', roomController.getRoom);
router.post('/api/room/add', roomController.addRoom);
router.delete('/api/room/delete/:roomID', roomController.deleteRoom)
router.delete('/api/room/delete-if-empty/:roomID', roomController.deleteRoomIfEmpty);
router.put('/api/room/users/inc', roomController.increaseUserCount);
router.get('/api/room', roomController.getAllRooms);

module.exports = router;
