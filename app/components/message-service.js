angular.module('WaffleApp').service('MessageService', ['socket', '$q', 'RoomService', function MessageService(socket, $q, roomService) {
	var self = this;
	this.data = {
		messages: [] // Start off with an empty list
	};
	var currentRoomId = null;

	var messageCache = {};
	var pendingRequests = {};

	function addMessage(message) {
		getOrCreateList(message.roomId).then(function(messageList) {
			messageList.push(message);
			messageList.sort(function(a, b) {
				return a.id - b.id;
			});
		});
	}

	function getOrCreateList(roomId) {
		console.log("Getting list for room ", roomId);
		var deferred = pendingRequests[roomId];
		if (deferred) {
			console.log("Deferred already exists:", deferred);
			return deferred.promise;
		}

		deferred = $q.defer();
		var messageList = messageCache[roomId];
		if (messageList) {
			deferred.resolve(messageList);
		} else {
			console.log("No messages in cache, deferring");
			pendingRequests[roomId] = deferred;
			socket.emit('message/list', {
				roomId: roomId
			});
		}
		return deferred.promise;
	}

	function changeRoom(roomId) {
		console.log("Changing room to", roomId);
		if (roomId > 0) {
			currentRoomId = roomId;
			getOrCreateList(roomId).then(function(messages) {
				self.data.messages = messages;
			})
		}
	}

	socket.on('message/new', function(data) {
		console.log("New message", data);
		addMessage(data);
	});

	socket.on('message/list', function(data) {
		console.log("Got a pile of data", data.roomId, data.messages);
		var oldMessages = messageCache[data.roomId] || [];
		var newMessages = data.messages;

		var messages = merge(oldMessages, newMessages);
		messageCache[data.roomId] = messages;
		console.log("Result of merge is", messages);
		if (pendingRequests[data.roomId]) {
			console.log("Resolving promise");
			pendingRequests[data.roomId].resolve(messages);
			delete pendingRequests[data.roomId];
		}
	});

	this.notifyRoomService = function() {
		console.log("Room service has changed", currentRoomId, roomService.data.currentRoomId, currentRoomId !== roomService.data.currentRoomId);
		if (currentRoomId !== roomService.data.currentRoomId) {
			changeRoom(roomService.data.currentRoomId);
		}
	};

	this.post = function(text) {
		socket.emit('message/new', {
			roomId: roomService.data.currentRoomId,
			message: text
		})
	};

	roomService.addObserver(this);

	function merge(oldMessages, newMessages) {
		newMessages.sort(function(a, b) {
			return a.id - b.id;
		});
		var oldLength = oldMessages.length;
		var newLength = newMessages.length;
		var result = [];
		var i = 0;
		var j = 0;
		while (i < oldLength || j < newLength) {
			if (i >= oldLength) {
				if (result.length === 0 || newMessages[j].id > result[result.length - 1].id) {
					result.push(newMessages[j]);
				}
				j++;
			} else if (j >= newLength) {
				if (result.length === 0 || oldMessages[i].id > result[result.length - 1].id) {
					result.push(oldMessages[i]);
				}
				i++;
			} else if (newMessages[j].id < oldMessages[i].id) {
				result.push(newMessages[j]);
				j++;
			} else if (newMessages[j].id > oldMessages[i].id) {
				result.push(oldMessages[i]);
				i++;
			} else {
				// Identical IDs
				result.push(newMessages[j]);
				i++;
				j++;
			}
		}
		return result;
	}
}]);