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
		socket.emit('room/join', {
			roomId: roomId
		});
		notifyObservers();
	};

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