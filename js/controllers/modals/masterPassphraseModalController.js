require('angular');

angular.module('webApp').controller('masterPassphraseModalController', ["$scope", "masterPassphraseModal", function ($scope, masterPassphraseModal) {

    $scope.masterPass = '';
    $scope.emptyPass = false;

    $scope.title = $scope.title || 'Please enter master password.';
    $scope.label = $scope.label || 'Master Passphrase';

    $scope.close = function (pass) {
        if ($scope.destroy) {
            $scope.destroy(pass);
        }
        masterPassphraseModal.deactivate();
    }
    $scope.passcheck = function (pass) {
        $scope.emptyPass = !pass;
        if (!$scope.emptyPass) {
            $scope.close(pass);
        }
    }


}]);
