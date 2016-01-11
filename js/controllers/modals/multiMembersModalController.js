require('angular');

angular.module('webApp').controller('multiMembersModalController', ["$scope", "multiMembersModal", function ($scope, multiMembersModal) {

    $scope.title = $scope.confirmed ? 'Confirmed by' : 'Members';
    $scope.close = function () {
        if ($scope.destroy) {
            $scope.destroy();
        }
        multiMembersModal.deactivate();
    }

}]);