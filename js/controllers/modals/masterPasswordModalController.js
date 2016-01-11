require('angular');

angular.module('webApp').controller('masterPasswordModalController', ["$scope", "masterPasswordModal", function ($scope, masterPasswordModal) {

    $scope.masterPass = '';
    $scope.emptyPass = false;

    $scope.title = $scope.title || 'Please enter master password.';
    $scope.label = $scope.label || 'Master Password';

    $scope.close = function (pass) {
        if ($scope.destroy) {
            $scope.destroy(pass);
        }
        masterPasswordModal.deactivate();
    }
    $scope.passcheck = function (pass) {
        $scope.emptyPass = !pass;
        if (!$scope.emptyPass) {
            $scope.close(pass);
        }
    }


}]);