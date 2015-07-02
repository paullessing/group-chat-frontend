'use strict';

// Declare app level module which depends on views, and components
angular.module('WaffleApp', [
	'btford.socket-io',
	'ngRoute'
]).config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl: 'views/login/login.html',
		resolve: {
			auth: ['$q', '$location', 'LoginService', function($q, $location, loginService) {
				if (loginService.isLoggedIn()) {
					$location.path('/');
					$location.replace();
					$q.reject(new Error('Already Logged in'));
				}
			}]
		}
	})
	.when('/', {
		templateUrl: 'views/chat/chat.html',
		resolve: {
			auth: ['$q', '$location', 'LoginService', function($q, $location, loginService) {
				if (!loginService.isLoggedIn()) {
					$location.path('/login');
					$location.replace();
					$q.reject(new Error('Not logged in'));
				}
			}]
		}
	})
	.otherwise({
		redirectTo: '/'
	});
}]);