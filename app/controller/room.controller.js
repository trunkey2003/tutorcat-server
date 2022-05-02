const room = require('../model/room.model');

class RoomController {
    getRoom(req, res) {
        var filter = {};
        filter.roomID = req.query?.roomID;
        room.findOne(
            filter
        ).then((room) => {
            res.send(room);
        })
            .catch(() =>
                res.status(500).send({ message: "Cannot get rooms" })
            )
    }

    getAllRooms(req, res) {
        room.find(
            {}
        ).then((room) => {
            res.status(200).send(room);
        })
            .catch(() =>
                res.status(500).send({ message: "Cannot get all rooms" })
            )
    }

    addRoom(req, res){
        const newRoom = new room(req.body);
        newRoom.save()
        .then(() => {
            res.status(200).send({ message: "created" });
        })
        .catch(() =>{
            res.status(403).send({ message: "fail create room" })
        });
    }

    modifyRoom(req, res) {
        const roomObject = req.body;
        const roomId = req.params.roomId;
        room.findOneAndUpdate({ _id: roomId }, roomObject, { new: true })
            .then((room) => {
                res.send(room);
            })
            .catch(() => res.status(403).send({ message: "Cannot modify room" }));
    }

    deleteRoom(req, res) {
        const roomID = req.params.roomID;
        room.findOneAndDelete({ roomID: roomID }).then(() =>
            res.send({ message: `delete ${roomID}` })
        )
        .catch((err) => {
            console.log(err);
            res.status(403).send({ message: "Cannot delete room" });
        });
    }

    deleteRoomIfEmpty(req, res){
        const roomID = req.params.roomID;
        room.findOneAndDelete({ roomID: roomID, usersJoined : 0 })
        .then(() =>
            res.send({ message: `delete ${roomID}` })
        )
        .catch((err) => {
            console.log(err);
            res.status(403).send({ message: "Cannot delete room" });
        });
    }

    increaseUserCount(req, res){
        const roomID = req.params.roomID;
    }

}

module.exports = new RoomController;