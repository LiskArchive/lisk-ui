require('angular');

angular.module('webApp').controller('passphraseController', ['$scope', '$rootScope', '$http', "$state", "userService", "newUser",
    function ($rootScope, $scope, $http, $state, userService, newUser) {
        userService.setData();
        userService.rememberPassword = false;
        userService.rememberedPassword = '';
        $scope.rememberPassword = true;
        $scope.errorMessage = "";

        // angular.element(document.getElementById("forgingButton")).show();
        $scope.newUser = function () {
            $scope.newUserModal = newUser.activate({
                destroy: function () {
                }
            });
        }
        $scope.login = function (pass, remember) {
            if (pass.length>100) {
                $scope.errorMessage = 'Password must contain less than 100 characters.';
                return;
            }
            var data = {secret: pass};
            $scope.errorMessage = "";
            $http.post("/api/accounts/open/", {secret: pass})
                .then(function (resp) {
                    if (resp.data.success) {
                        userService.setData(resp.data.account.address, resp.data.account.publicKey, resp.data.account.balance, resp.data.account.unconfirmedBalance, resp.data.account.effectiveBalance);
                        userService.setForging(resp.data.account.forging);
                        userService.setSecondPassphrase(resp.data.account.secondSignature || resp.data.account.unconfirmedSignature);
                        userService.unconfirmedPassphrase = resp.data.account.unconfirmedSignature;
                        if (remember) {
                            userService.setSessionPassword(pass);
                        }
                        //angular.element(document.getElementById("forgingButton")).hide();
                        $state.go('main.dashboard');
                    } else {
                        $scope.errorMessage = resp.data.error;
                    }
                });
        }
    }]);