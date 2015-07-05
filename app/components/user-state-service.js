angular.module('WaffleApp').service('UserStateService', ['socket', '$q', function UserStateService(socket, $q) {
	var self = this;
	this.state = {};
	this.isAuthenticated = false;
	this.loginDetails = null;

	var pendingLogin = $q.defer();

	this.login = function(user) {
		self.loginDetails = angular.extend({}, user);
		return doLogin();
	};

	this.whenLoggedIn = function() {
		return pendingLogin.promise;
	};

	function doLogin() {
		socket.emit('user/signin', self.loginDetails);
		return pendingLogin.promise;
	}

	socket.on('user/signin', function(data) {
		self.state.username = data.username;
		self.state.id = data.id;
		self.isAuthenticated = true;
		pendingLogin.resolve();
	});

	socket.on('user/require-auth', function() {
		self.isAuthenticated = false;
		console.log("User is not authenticated!");
		if (self.loginDetails) {
			doLogin();
		}
	});
}]);