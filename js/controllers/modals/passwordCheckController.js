require('angular');

angular.module('webApp').controller('passwordCheckController.js', ["$scope", "passwordCheckController", "$http", "userService", function ($scope, passwordCheckController, $http, userService) {

    $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;
    $scope.secondPassphrase = userService.secondPassphrase;

    $scope.close = function () {
        if ($scope.destroy) {
            $scope.destroy();
        }
        passwordCheckController.deactivate();
    }

}]);