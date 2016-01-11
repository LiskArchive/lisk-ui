require('angular');

angular.module('webApp').controller('userSettingsModalController', ["$scope", "$http", "userSettingsModal", "userService", function ($scope, $http, userSettingsModal, userService) {

    $scope.error = null;
    $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;
    $scope.secondPassphrase = userService.secondPassphrase;
    $scope.focus = 'username';
    $scope.presendError = false;
    $scope.username = '';

    $scope.passcheck = function (fromSecondPass) {
        $scope.error =  null;
        if (fromSecondPass) {
            $scope.checkSecondPass = false;
            $scope.passmode = $scope.rememberedPassword ? false : true;
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
        var isAddress = (/^[0-9]+[C|c]$/g).test($scope.username);
        var allowSymbols = (/^[a-z0-9!@$&_.]+$/g).test($scope.username.toLowerCase());
        if ($scope.rememberedPassword) {

            if ($scope.username.trim() == '') {
                $scope.error = 'Empty username'
                $scope.presendError = true;
            } else {
                if (!isAddress) {
                    if (allowSymbols) {
                        $scope.presendError = false;
                        $scope.error = null;
                        $scope.saveName($scope.rememberedPassword);
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
            if ($scope.rememberedPassword) {
                data.secret = $scope.rememberedPassword;
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