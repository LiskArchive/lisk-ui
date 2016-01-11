require('angular');

angular.module('webApp').controller('secondPassphraseModalController', ["$scope", "secondPassphraseModal", "$http", "userService", function ($scope, secondPassphraseModal, $http, userService) {

    $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;
    $scope.passmode = false;
    $scope.focus = 'secondPass';
    $scope.fee = 0;

    $scope.getFee = function () {
        $http.get("/api/signatures/fee").then(function (resp) {
            if (resp.data.success) {
                $scope.fee = resp.data.fee;
            }
            else {
                $scope.fee = 0;
            }
        });
    }
    $scope.getFee();

    $scope.close = function () {
        if ($scope.destroy) {
            $scope.destroy();
        }
        secondPassphraseModal.deactivate();
    }

    $scope.passcheck = function () {
        if ($scope.rememberedPassword) {
            $scope.addNewPassphrase($scope.rememberedPassword);
        }
        else {
            $scope.passmode = !$scope.passmode;
            if ($scope.passmode) {
                $scope.focus = 'pass';
            }
            else {
                $scope.focus = 'secondPass';
            }
            $scope.pass = '';
        }
    }

    $scope.addNewPassphrase = function (pass) {
        $scope.fromServer = '';
        if ($scope.repeatSecretPhrase != $scope.newSecretPhrase) {
            $scope.fromServer = 'Password and Confirm Password don\'t match';
            return;
        }
        if ((($scope.repeatSecretPhrase ? $scope.repeatSecretPhrase.trim() : '') == '') || (($scope.newSecretPhrase ? $scope.newSecretPhrase.trim() : '') == '')) {
            $scope.fromServer = 'Missing Password or Confirm Password';
            return;
        }
        $http.put("/api/signatures", {
            secret: pass,
            secondSecret: $scope.newSecretPhrase,
            publicKey: userService.publicKey
        }).then(function (resp) {
            if (resp.data.error) {
                $scope.fromServer = resp.data.error;
            }
            else {
                if ($scope.destroy) {
                    $scope.destroy(true);
                }

                secondPassphraseModal.deactivate();
            }
        });
    }
}]);