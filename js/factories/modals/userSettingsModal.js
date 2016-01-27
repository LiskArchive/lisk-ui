require('angular');

angular.module('liskApp').factory('userSettingsModal', function (btfModal) {
    return btfModal({
        controller: 'userSettingsModalController',
        templateUrl: '/partials/modals/userSettingsModal.html'
    });
});
