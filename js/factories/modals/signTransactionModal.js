require('angular');

angular.module('webApp').factory('passwordCheck', function (btfModal) {
    return btfModal({
        controller: 'passwordCheckController',
        templateUrl: '/partials/modals/passwordCheck.html'
    });
});