require('angular');

angular.module('webApp').controller('registrationDelegateModalController', ["$scope", "registrationDelegateModal", "$http", "userService", "delegateService",
    function ($scope, registrationDelegateModal, $http, userService, delegateService) {
        $scope.error = null;
        $scope.delegate = userService.delegate;
        $scope.action = false;
        $scope.isSecondPassphrase = userService.secondPassphrase;
        $scope.passmode = false;
        $scope.delegateData = {username: ''};
        $scope.secondPassphrase = userService.secondPassphrase;
        $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;

        $scope.fee = 0;
        $scope.focus = 'username';

        $scope.getFee = function () {
            $http.get("/api/delegates/fee").then(function (resp) {
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

            registrationDelegateModal.deactivate();
        }

        $scope.passcheck = function (fromSecondPass) {
            $scope.error = null;
            if (fromSecondPass) {
                $scope.checkSecondPass = false;
                $scope.passmode = $scope.rememberedPassword ? false : true;
                $scope.secondPhrase = '';
                $scope.pass = '';
                if ($scope.passmode) {
                    $scope.focus = 'secretPhrase';
                }
                else {
                    $scope.focus = 'username';
                }
                return;
            }
            if ($scope.rememberedPassword) {
                var isAddress = /^[0-9]+[C|c]$/g;
                var allowSymbols = /^[a-z0-9!@$&_.]+$/g;
                if ($scope.delegateData.username.trim() == '' && !$scope.username) {
                    $scope.error = 'Empty username'
                } else {
                    if (!isAddress.test($scope.delegateData.username) || !!$scope.username) {
                        if (allowSymbols.test($scope.delegateData.username.toLowerCase()) || !!$scope.username) {
                            $scope.error = null;
                            $scope.registrationDelegate($scope.rememberedPassword);
                        }
                        else {
                            $scope.error = 'Username can only contain alphanumeric characters with the exception of !@$&_.'
                        }
                    }
                    else {
                        $scope.error = 'Username cannot be a potential address.'
                    }
                }

            }
            else {
                var isAddress = /^[0-9]+[C|c]$/g;
                var allowSymbols = /^[a-z0-9!@$&_.]+$/g;
                if ($scope.delegateData.username.trim() == '' && !$scope.username) {
                    $scope.error = 'Empty username'
                } else {
                    if (!isAddress.test($scope.delegateData.username) || !!$scope.username) {
                        if (allowSymbols.test($scope.delegateData.username.toLowerCase()) || !!$scope.username) {
                            $scope.error = null;
                            $scope.focus = 'secretPhrase';
                            $scope.passmode = !$scope.passmode;
                            $scope.pass = '';
                        }
                        else {
                            $scope.error = 'Username can only contain alphanumeric characters with the exception of !@$&_.'
                        }
                    }
                    else {
                        $scope.error = 'Username cannot be a potential address.'
                    }
                }


            }
        }

        $scope.registrationDelegate = function (pass, withSecond) {
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
                secondSecret: $scope.secondPhrase,
                publicKey: userService.publicKey
            };
            if ($scope.delegateData.username.trim() != '') {
                data.username = $scope.delegateData.username.trim()
            }
            if ($scope.secondPassphrase) {
                data.secondSecret = $scope.secondPhrase;
                if ($scope.rememberedPassword) {
                    data.secret = $scope.rememberedPassword;
                }
            }
            $http.put("/api/delegates/", data)
                .then(function (resp) {
                    $scope.action = false;
                    userService.setDelegateProcess(resp.data.success);

                    if (resp.data.success) {
                        if ($scope.destroy) {
                            $scope.destroy();
                        }

                        registrationDelegateModal.deactivate();
                    } else {
                        $scope.error = resp.data.error;
                    }
                });
        }

    }]);