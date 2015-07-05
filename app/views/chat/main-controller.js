angular.module('WaffleApp').controller('mainCtrl', [ 'UserStateService', function(userStateService) {
	this.userState = userStateService.state;
} ]);