angular.module('WaffleApp').controller('loginCtrl', ['$location', 'LoginService',
function($location, loginService) {
	var self = this;

	this.login = function() {
		loginService.login(this.user).then(function() {
			$location.path('/');
		});
	};
}
]);