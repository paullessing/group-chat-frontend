angular.module('WaffleApp').directive('waffleMessages', function() {
	return {
		restrict: 'E',
		scope: {},
		templateUrl: 'views/chat/message-list.html',
		replace: true,
		controller: 'MessageListCtrl',
		controllerAs: 'ctrl'
	};
}).controller('MessageListCtrl', ['MessageService', function(messageService) {
	var self = this;

	this.data = messageService.data;
}]);