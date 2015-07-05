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

	this.post = function() {
		messageService.post(self.message.text);
		self.message = {};
	};

	this.isInRoom = function() {
		return !!roomService.data.currentRoomId;
	};
}]);