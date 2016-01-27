require('angular');

angular.module('webApp').factory('sendTransactionModal', function (btfModal) {
    return btfModal({
        controller: 'sendTransactionController',
        templateUrl: '/partials/modals/sendTransaction.html'
    });
});
