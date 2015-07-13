angular.module('WaffleApp').directive('waffleRoomList', function() {
	return {
		restrict: 'E',
		scope: {},
		templateUrl: 'views/chat/room-list.html',
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
	this.view = function(roomId) {
		roomService.join(roomId);
	};
}]);