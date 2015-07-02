angular.module('WaffleApp').service('LoginService', ['socket', '$q', function LoginService(socket, $q) {
	var self = this;
	this.state = {};

	var pendingLogin = $q.defer();

	this.login = function(user) {
		socket.emit('user/signin', user);
		return pendingLogin.promise;
	};

	socket.on('user/signin', function(data) {
		self.state.username = data.username;
		self.state.id = data.id;
		pendingLogin.resolve();
	});

	this.isLoggedIn = function() {
		return !!this.state.id;
	};
}]);