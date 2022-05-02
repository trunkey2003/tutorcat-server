const room = require("../model/room.model");

class RoomController {
  getRoom(req, res) {
    var filter = {};
    filter.roomID = req.params.roomID;
    room
      .findOne(filter)
      .then((room) => {
        console.log(filter);
        res.send(room);
      })
      .catch(() => res.status(500).send({ message: "Cannot get rooms" }));
  }

  getAllRooms(req, res) {
    room
      .find({})
      .then((room) => {
        res.status(200).send(room);
      })
      .catch(() => res.status(500).send({ message: "Cannot get all rooms" }));
  }

  addRoom(req, res) {
    const newRoom = new room(req.body);
    newRoom
      .save()
      .then(() => {
        res.status(200).send({ message: "created" });
      })
      .catch(() => {
        res.status(503).send({ message: "fail create room" });
      });
  }

  modifyRoom(req, res) {
    const roomObject = req.body;
    const roomId = req.params.roomId;
    room
      .findOneAndUpdate({ _id: roomId }, roomObject, { new: true })
      .then((room) => {
        res.send(room);
      })
      .catch(() => res.status(503).send({ message: "Cannot modify room" }));
  }

  deleteRoom(req, res) {
    const roomID = req.params.roomID;
    room
      .findOneAndDelete({ roomID: roomID })
      .then(() => res.send({ message: `delete ${roomID}` }))
      .catch((err) => {
        console.log(err);
        res.status(503).send({ message: "Cannot delete room" });
      });
  }

  deleteRoomIfEmpty(req, res) {
    const roomID = req.params.roomID;
    room
      .findOneAndDelete({ roomID: roomID, userCount: 0 })
      .then(() => res.send({ message: `delete ${roomID}` }))
      .catch((err) => {
        console.log(err);
        res.status(503).send({ message: "Cannot delete room" });
      });
  }

  increaseUserCount(req, res) {
    const roomID = req.params.roomID;
    const userID = req.params.userID;
    room
      .findOne({ roomID: roomID })
      .then((_room) => {
        if (!_room) {
          res.status(404).send({ message: "Cannot join room " + roomID });
          return;
        }

        if (_room.userCount >= 2) {
          res.status(403).send({ message: "Cannot join room " + roomID });
          return;
        }

        if (_room.userCount == 0) {
          room
            .findOneAndUpdate(
              { roomID: roomID },
              { $inc: { userCount: 1 }, $set: { userID1: userID } },
              { new: true }
            )
            .then((room) => {
              res.status(200).send(room);
            })
            .catch(() => {
              res.status(503).send({ message: "Cannot join room " + roomID });
            });
          return;
        }

        if (_room.userCount == 1) {
          room
            .findOneAndUpdate(
              { roomID: roomID },
              { $inc: { userCount: 1 }, $set: { userID2: userID } },
              { new: true }
            )
            .then((room) => {
              res.status(200).send(room);
            })
            .catch(() => {
              res.status(503).send({ message: "Cannot join room " + roomID });
            });
          return;
        }
      })

      .catch((err) => {
        console.log(err);
        res.status(503).send({ message: "Cannot join room " + roomID });
      });
  }

  decreaseUserCount(req, res) {
    const roomID = req.params.roomID;

    room
      .findOne({ roomID: roomID })
      .then((_room) => {
        if (_room.userCount <= 0) {
          room
            .findOneAndDelete({ roomID: roomID })
            .then(() => res.status(200).send(OK));
        } else {
          room
            .findOneAndUpdate(
              { roomID: roomID },
              { $inc: { userCount: 1 } },
              { new: true }
            )
            .then((room) => {
              res.status(200).send(room);
            })
            .catch(() => {
              res.status(503).send({ message: "Cannot join room " + roomID });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(503).send({ message: "Cannot join room " + roomID });
      });
  }
}

module.exports = new RoomController();
