angular.module('WaffleApp').controller('mainCtrl', [ 'LoginService', function(loginService) {
	this.userState = loginService.state;
} ]);