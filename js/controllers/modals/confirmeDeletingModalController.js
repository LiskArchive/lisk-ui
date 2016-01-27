require('angular');

angular.module('liskApp').controller('confirmeDeletingModalController', ["$scope", "confirmeDeletingModal", function ($scope, confirmeDeletingModal) {

    $scope.close = function (yesDelete) {
        if ($scope.destroy) {
            $scope.destroy(yesDelete);
        }
        confirmeDeletingModal.deactivate();
    }



}]);
