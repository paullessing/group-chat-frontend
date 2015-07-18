angular.module('WaffleApp').directive('waffleLogin', function() {
	return {
		restrict: 'E',
		scope: {},
		templateUrl: 'views/login/login.html',
		replace: true,
		controller: 'LoginFormCtrl',
		controllerAs: 'ctrl'
	};
}).controller('LoginFormCtrl', ['$location', 'UserStateService', function($location, userStateService) {
	var self = this;

	this.login = function() {
		userStateService.login(self.user)
			.then(function() {
                console.log("Login has been resolved");
				$location.path('/');
			});
	};
}]);