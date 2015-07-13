angular.module('WaffleApp').directive('waffleNewRoomForm', function() {
	return {
		restrict: 'E',
		scope: {},
		templateUrl: 'views/chat/new-room-form.html',
		replace: true,
		controller: 'NewRoomFormCtrl',
		controllerAs: 'ctrl'
	};
}).controller('NewRoomFormCtrl', ['RoomService', function(roomService) {
	var self = this;

	this.createRoom = function() {
		roomService.create(self.newRoom);
		self.newRoom = {};
	};
}]);