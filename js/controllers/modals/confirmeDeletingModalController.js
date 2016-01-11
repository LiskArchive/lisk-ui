require('angular');

angular.module('webApp').controller('confirmeDeletingModalController', ["$scope", "confirmeDeletingModal", function ($scope, confirmeDeletingModal) {

    $scope.close = function (yesDelete) {
        if ($scope.destroy) {
            $scope.destroy(yesDelete);
        }
        confirmeDeletingModal.deactivate();
    }



}]);