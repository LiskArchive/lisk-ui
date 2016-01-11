require('angular');

angular.module('webApp').factory('userSettingsModal', function (btfModal) {
    return btfModal({
        controller: 'userSettingsModalController',
        templateUrl: '/partials/modals/userSettingsModal.html'
    });
});