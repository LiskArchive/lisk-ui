require('angular');

angular.module('liskApp').controller('forgingModalController', ["$scope", "forgingModal", "$http", "userService", 'gettextCatalog', function ($scope, forgingModal, $http, userService, gettextCatalog) {

    $scope.error = null;
    $scope.forging = userService.forging;
    $scope.fee = 0;
    $scope.focus = 'secretPhrase';

    if ($scope.forging) {
        $scope.label = gettextCatalog.getString('Disable Forging');
    } else {
        $scope.label = gettextCatalog.getString('Enable Forging');
    }

    $scope.close = function () {
        if ($scope.destroy) {
            $scope.destroy($scope.forging);
        }

        forgingModal.deactivate();
    }

    $scope.forgingState = function () {
        if ($scope.forging) {
            $scope.stopForging();
        } else {
            $scope.startForging();
        }
    }

    $scope.startForging = function () {
        $scope.error = null;

        if ($scope.forging) {
            return $scope.stopForging();
        }

        $http.post("/api/delegates/forging/enable", {secret: $scope.secretPhrase, publicKey: userService.publicKey})
            .then(function (resp) {
                userService.setForging(resp.data.success);
                $scope.forging = resp.data.success;

                if (resp.data.success) {
                    if ($scope.destroy) {
                        $scope.destroy(resp.data.success);
                    }

                    forgingModal.deactivate();
                } else {
                    $scope.error = resp.data.error;
                }
            });
    }

    $scope.stopForging = function () {
        $scope.error = null;

        $http.post("/api/delegates/forging/disable", {secret: $scope.secretPhrase, publicKey: userService.publicKey})
            .then(function (resp) {
                userService.setForging(!resp.data.success);
                $scope.forging = !resp.data.success;

                if (resp.data.success) {
                    if ($scope.destroy) {
                        $scope.destroy(!resp.data.success);
                    }

                    forgingModal.deactivate();
                } else {
                    $scope.error = resp.data.error;
                }
            });
    }

}]);
