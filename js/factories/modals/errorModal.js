require('angular');

angular.module('webApp').factory('errorModal', function (btfModal) {
    return btfModal({
        controller: 'errorModalController',
        templateUrl: '/partials/modals/errorModal.html'
    });
});