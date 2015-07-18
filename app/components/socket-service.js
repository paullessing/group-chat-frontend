angular.module('WaffleApp').factory('socket', ['socketFactory', '$q', 'Auth', function (socketFactory, $q, Auth) {
	// TODO this should not connect automatically; it should need to be connected manually

    var initDefer = $q.defer();
	var socket, ioSocket, isAuthenticated,
		self = {
			getAuthenticated: function(){
				return isAuthenticated;
			},
            on: function() {
                var args = arguments;
                console.log("Called on with ", args);
                self.whenInitialized.then(function() {
                    console.log("Initialised, now calling apply on on", args);
                    self.socket.on.apply(self.socket, args);
                });
            },
            emit: function() {
                var args = arguments;
                console.log("Called emit with ", args);
                self.whenInitialized.then(function() {
                    console.log("Initialised, now calling apply on emit", args);
                    self.socket.emit.apply(self.socket, args);
                });
            },
            whenInitialized: initDefer.promise
		};

	// by default the socket property is null and is not authenticated
	self.socket = socket;
	// initializer function to connect the socket for the first time after logging in to the app
	self.initialize = function(){
		// TODO probably need to make sure we don't init twice
		console.log('initializing socket');

		isAuthenticated = false;

		// socket.io now auto-configures its connection when we omit a connection url
		ioSocket = io('http://localhost:3000', {
			//path: '/socket-io'
		});

		//call btford angular-socket-io library factory to connect to server at this point
		self.socket = socket = socketFactory({
			ioSocket: ioSocket
		});

		//---------------------
		//these listeners will only be applied once when socket.initialize is called
		//they will be triggered each time the socket connects/re-connects (e.g. when logging out and logging in again)
		//----------------------
		socket.on('authenticated', function () {
			isAuthenticated = true;
			console.log('socket is jwt authenticated');
            initDefer.resolve(socket);
		});
		//---------------------
		socket.on('connect', function () {
			//send the jwt
			socket.emit('authenticate', { token: Auth.authToken });
		});

        socket.on('system/error', function(message) {
            console.error("Socket error", message); // TODO debug code
        });

		return self.whenInitialized;
	};

	return self;
}]);