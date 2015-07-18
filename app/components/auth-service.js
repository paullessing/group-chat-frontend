angular.module('WaffleApp').service('Auth', [function Auth() {
    var self = this;

    this.setAuthToken = function(token) {
        self.authToken = token;
    };
}]);