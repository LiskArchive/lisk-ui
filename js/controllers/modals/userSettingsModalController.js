require('angular');

angular.module('liskApp').controller('userSettingsModalController', ["$scope", "$http", "userSettingsModal", "userService", function ($scope, $http, userSettingsModal, userService) {

    $scope.error = null;
    $scope.rememberedPassphrase = userService.rememberPassphrase ? userService.rememberedPassphrase : false;
    $scope.secondPassphrase = userService.secondPassphrase;
    $scope.focus = 'username';
    $scope.presendError = false;
    $scope.username = '';

    $scope.passcheck = function (fromSecondPass) {
        $scope.error =  null;
        if (fromSecondPass) {
            $scope.checkSecondPass = false;
            $scope.passmode = $scope.rememberedPassphrase ? false : true;
            if ($scope.passmode){
                $scope.focus = 'passPhrase';
            }
            else {
                $scope.focus = 'username';
            }
            $scope.secondPhrase = '';
            $scope.pass = '';
            return;
        }
        var isAddress = (/^[0-9]+[L|l]$/g).test($scope.username);
        var allowSymbols = (/^[a-z0-9!@$&_.]+$/g).test($scope.username.toLowerCase());
        if ($scope.rememberedPassphrase) {

            if ($scope.username.trim() == '') {
                $scope.error = 'Empty username'
                $scope.presendError = true;
            } else {
                if (!isAddress) {
                    if (allowSymbols) {
                        $scope.presendError = false;
                        $scope.error = null;
                        $scope.saveName($scope.rememberedPassphrase);
                    }
                    else {
                        $scope.error = 'Username can only contain alphanumeric characters with the exception of !@$&_.'
                        $scope.presendError = true;
                    }
                }
                else {
                    $scope.error = 'Username cannot be a potential address.'
                    $scope.presendError = true;
                }
            }

        }
        else {
            if ($scope.username.trim() == '') {
                $scope.error = 'Empty username'
                $scope.presendError = true;
            } else {
                if (!isAddress) {
                    if (allowSymbols) {
                        $scope.presendError = false;
                        $scope.error = null;
                        $scope.focus = 'passPhrase';
                        $scope.passmode = !$scope.passmode;
                        $scope.pass = '';
                    }
                    else {
                        $scope.error = 'Username can only contain alphanumeric characters with the exception of !@$&_.'
                        $scope.presendError = true;
                    }
                }
                else {
                    $scope.error = 'Username cannot be a potential address.'
                    $scope.presendError = true;
                }
            }

        }
    }

    $scope.close = function () {
        userSettingsModal.deactivate();
    }

    $scope.saveName = function (pass, withSecond) {
        if ($scope.secondPassphrase && !withSecond) {
            $scope.focus = 'secondPhrase';
            $scope.checkSecondPass = true;
            return;
        }
        pass = pass || $scope.secretPhrase;
        $scope.action = true;
        $scope.error = null;

        var data = {
            secret: pass,
            username: $scope.username,
            publicKey: userService.publicKey};

        if ($scope.secondPassphrase) {
            data.secondSecret = $scope.secondPhrase;
            if ($scope.rememberedPassphrase) {
                data.secret = $scope.rememberedPassphrase;
            }
        }
        $http.put("/api/accounts/username", data)
            .then(function (resp) {
                $scope.action = false;

                if (resp.data.success) {
                    if ($scope.destroy) {
                        $scope.destroy();
                    }

                    userSettingsModal.deactivate();
                } else {
                    $scope.error = resp.data.error;
                }
            });
    }

}]);
