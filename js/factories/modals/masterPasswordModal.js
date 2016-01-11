require('angular');

angular.module('webApp').factory('masterPasswordModal', function (btfModal) {
    return btfModal({
        controller: 'masterPasswordModalController',
        templateUrl: '/partials/modals/masterPasswordModal.html'
    });
});
