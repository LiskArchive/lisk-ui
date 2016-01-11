require('angular');

angular.module('webApp').factory('addDappModal', function (btfModal) {
    return btfModal({
        controller: 'addDappModalController',
        templateUrl: '/partials/modals/addDappModal.html'
    });
});