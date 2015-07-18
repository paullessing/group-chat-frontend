angular.module('WaffleApp').directive('waffleMessageBox', function() {
	return {
		restrict: 'E',
		scope: {},
		templateUrl: 'views/chat/message-box.html',
		replace: true,
		controller: 'MessageBoxCtrl',
		controllerAs: 'ctrl'
	};
}).controller('MessageBoxCtrl', ['MessageService', 'RoomService', function(messageService, roomService) {
	var self = this;
    self.message = {};

	this.post = function() {
        if (self.message.text) {
            messageService.post(self.message.text);
            self.message = {};
        }
	};

	this.isInRoom = function() {
		return !!roomService.data.currentRoomId;
	};

	this.keyDown = function(event) {
		if (event.keyCode === 13 && !event.shiftKey) {
			self.post();
			event.preventDefault();
		}
	};
}]);