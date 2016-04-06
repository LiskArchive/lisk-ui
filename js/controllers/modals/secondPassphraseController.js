require('angular');

angular.module('liskApp').controller('secondPassphraseModalController', ["$scope", "secondPassphraseModal", "$http", "userService", function ($scope, secondPassphraseModal, $http, userService) {

    $scope.rememberedPassphrase = userService.rememberPassphrase ? userService.rememberedPassphrase : false;
    $scope.passmode = false;
    $scope.focus = 'secondPass';
    $scope.fee = 0;
    $scope.step = 1;

    $scope.getFee = function () {
        $http.get("/api/signatures/fee").then(function (resp) {
            if (resp.data.success) {
                $scope.fee = resp.data.fee;
            } else {
                $scope.fee = 0;
            }
        });
    }

    $scope.getFee();

    $scope.goToStep = function (step) {
        $scope.passmode = false;
        $scope.repeatPassphrase = '';
        $scope.noMatch = false;
        $scope.step = step;
    }

    $scope.close = function () {
        if ($scope.destroy) {
            $scope.destroy();
        }
        secondPassphraseModal.deactivate();
    }

    $scope.generatePassphrase = function () {
        var code = new Mnemonic(Mnemonic.Words.ENGLISH);
        $scope.newPassphrase = code.toString();
    };

    $scope.generatePassphrase();

    $scope.savePassToFile = function (pass) {
        var blob = new Blob([pass], { type: "text/plain;charset=utf-8" });
        FS.saveAs(blob, "LiskSecondPassphrase.txt");
    }

    $scope.confirmNewPassphrase = function () {
        if (!Mnemonic.isValid($scope.repeatPassphrase) || ($scope.repeatPassphrase != $scope.newPassphrase)) {
            $scope.noMatch = true;
            return;
        } else {
            $scope.noMatch = false;
            $scope.passcheck();
        }
    }

    $scope.passcheck = function () {
        if ($scope.rememberedPassphrase) {
            $scope.addNewPassphrase($scope.rememberedPassphrase);
        } else {
            $scope.passmode = !$scope.passmode;
            if ($scope.passmode) {
                $scope.focus = 'pass';
            } else {
                $scope.focus = 'secondPass';
            }
            $scope.fromServer = '';
            $scope.pass = '';
        }
    }

    $scope.addNewPassphrase = function (pass) {
        $http.put("/api/signatures", {
            secret: pass,
            secondSecret: $scope.newPassphrase,
            publicKey: userService.publicKey
        }).then(function (resp) {
            if (resp.data.error) {
                $scope.fromServer = resp.data.error;
            } else {
                if ($scope.destroy) {
                    $scope.destroy(true);
                }

                secondPassphraseModal.deactivate();
            }
        });
    }

}]);
