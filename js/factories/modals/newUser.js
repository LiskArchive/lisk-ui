require('angular');

angular.module('webApp').factory('newUser', function (btfModal) {
    return btfModal({
        controller: 'newUserController',
        templateUrl: '/partials/modals/newUser.html'
    });
});