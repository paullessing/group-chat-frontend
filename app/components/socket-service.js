angular.module('WaffleApp').factory('socket', ['socketFactory', function (socketFactory) {
    return socketFactory({
        ioSocket: io('http://localhost:3000')
	});
}]);