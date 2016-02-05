require('angular');

angular.module('liskApp').controller('multiMembersModalController', ["$scope", "multiMembersModal", 'gettextCatalog', function ($scope, multiMembersModal, gettextCatalog) {

    $scope.title = $scope.confirmed ? gettextCatalog.getString('Confirmed by') : gettextCatalog.getString('Members');
    $scope.close = function () {
        if ($scope.destroy) {
            $scope.destroy();
        }
        multiMembersModal.deactivate();
    }

}]);
