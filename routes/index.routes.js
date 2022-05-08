var express = require('express');
const { route } = require('express/lib/application');
var router = express.Router();

const roomController = require('../app/controller/room.controller');
const compillerController = require('../app/controller/compiller.controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//room
router.get('/api/room/get/:roomID', roomController.getRoom);
router.post('/api/room/add', roomController.addRoom);
router.delete('/api/room/delete/:roomID', roomController.deleteRoom)
router.delete('/api/room/delete-if-empty/:roomID', roomController.deleteRoomIfEmpty);
router.put('/api/room/join/:roomID/:userID', roomController.increaseUserCount);
router.put('/api/room/leave/:roomID/:userID', roomController.decreaseUserCount);
router.get('/api/room/get', roomController.getAllAvailableRooms);


//compiler
router.post('/api/compiler/submission/create-and-get-result', compillerController.createSubmission, compillerController.getSubmission);
router.get('/api/compiler/submission/get/:submissionId', compillerController.getSubmission);

module.exports = router;
