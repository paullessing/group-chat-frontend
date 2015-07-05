angular.module('WaffleApp').directive('waffleRooms', function() {
	return {
		restrict: 'E',
		scope: {},
		templateUrl: 'views/chat/rooms.html',
		replace: true,
		controller: 'RoomListCtrl',
		controllerAs: 'ctrl'
	};
}).controller('RoomListCtrl', ['RoomService', function(roomService) {
	var self = this;

	this.data = roomService.data;

	this.join = function(roomId) {
		roomService.join(roomId);
	};
}]);