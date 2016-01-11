require('angular');

angular.module('webApp').controller('errorModalController', ["$scope", "errorModal", "userService", function ($scope, errorModal, userService) {
    $scope.forging =  userService.forging;
    $scope.fee = 0;
    $scope.focus = 'secretPhrase';


    if ($scope.forging) {
        $scope.label = "Disable Forging"
    }
    else {
        $scope.label = "Enable Forging"
    }

    $scope.label = $scope.title || $scope.label;

    $scope.close = function () {
        if ($scope.destroy) {
            $scope.destroy();
        }

        errorModal.deactivate();
    }


}]);