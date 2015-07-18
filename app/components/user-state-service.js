angular.module('WaffleApp').service('UserStateService', ['socket', '$q', '$http', '$location', 'Auth', function UserStateService(socket, $q, $http, $location, Auth) {
	var self = this;
	this.state = {};
	self.loginDetails = {};

	var pendingLogin = $q.defer();

	this.login = function(user) {
		// TODO use HTTP to log in!s
		// See https://auth0.com/blog/2014/01/15/auth-with-socket-io/
		// and https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/
		self.loginDetails = angular.extend({}, user);
		return doLogin();
	};

	this.whenLoggedIn = function() {
		return pendingLogin.promise;
	};

	function doLogin() {
		$http.post('http://localhost:3000/login', self.loginDetails).success(function(result) {
			Auth.setAuthToken(result.token);
			socket.initialize().then(function() {
                console.log("initialisation has resolved");
                self.isAuthenticated = true;

                socket.socket.on('disconnect', function() {
                    console.error('Disconnected!');
                    self.isAuthenticated = false;
                    $location.path('/?disconnect');
                });

				pendingLogin.resolve();
			});
		});
		//socket.emit('user/signin', self.loginDetails);
		return pendingLogin.promise;
	}

	//socket.on('user/signin', function(data) {
	//	self.state.username = data.username;
	//	self.state.id = data.id;
	//	self.isAuthenticated = true;
	//	pendingLogin.resolve();
	//});
    //
	//socket.on('user/require-auth', function() {
	//	self.isAuthenticated = false;
	//	console.log("User is not authenticated!");
	//	if (self.loginDetails) {
	//		doLogin();
	//	}
	//});
}]);