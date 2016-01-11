require('angular');

angular.module('webApp').factory('confirmeDeletingModal', function (btfModal) {
    return btfModal({
        controller: 'confirmeDeletingModalController',
        templateUrl: '/partials/modals/confirmeDeletingModal.html'
    });
});