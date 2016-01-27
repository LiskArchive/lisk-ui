require('angular');

angular.module('liskApp').factory('confirmeDeletingModal', function (btfModal) {
    return btfModal({
        controller: 'confirmeDeletingModalController',
        templateUrl: '/partials/modals/confirmeDeletingModal.html'
    });
});
