angular.module('WaffleApp').service('RoomService', ['socket', '$q', 'UserStateService', function RoomService(socket, $q, userStateService) {
	console.log("Initialising roomService");
	var self = this;
	this.data = {
		rooms: [],
		currentRoom: null
	};
	var observers = [];

	userStateService.whenLoggedIn().then(socket.emit('server/listRooms'));

	socket.on('server/listRooms', function(data) {
		console.log('Got room list', data);
		self.data.rooms = data.rooms;
		self.data.rooms.forEach(function(room) {
			room.isJoined = data.joined.indexOf(room.id) !== -1;
		});
		notifyObservers();
	});

	this.join = function(roomId) {
		self.data.currentRoomId = roomId;
		if (!isJoined(roomId)) {
			socket.emit('room/join', {
				roomId: roomId
			});
		}
		notifyObservers();
	};

	function isJoined(roomId) {
		var room = getRoom(roomId);
		return room && room.isJoined;
	}

	function getRoom(roomId) {
		for (var i = 0; i < self.data.rooms.length; i++) {
			var room = self.data.rooms[i];
			if (room.id === roomId) {
				return room;
			}
		}
		return null;
	}

	this.addObserver = function(observer) {
		if (observers.indexOf(observer) === -1) {
			observers.push(observer);
		}
	};

	function notifyObservers() {
		observers.forEach(function(observer) {
			if (typeof observer.notifyRoomService === 'function') {
				observer.notifyRoomService();
			}
		});
	}
}]);