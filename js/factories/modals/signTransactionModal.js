require('angular');

angular.module('webApp').factory('passphraseCheck', function (btfModal) {
    return btfModal({
        controller: 'passphraseCheckController',
        templateUrl: '/partials/modals/passphraseCheck.html'
    });
});
