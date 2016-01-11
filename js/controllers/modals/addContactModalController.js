require('angular');

angular.module('webApp').controller('addContactModalController', ["$scope", "addContactModal", "$http", "userService", "contactsService", "viewFactory","$timeout",
    function ($scope, addContactModal, $http, userService, contactsService, viewFactory, $timeout) {
        $scope.passmode = false;
        $scope.view = viewFactory;
        $scope.view.loadingText = "Adding new contact";
        $scope.view.inLoading = false;
        $scope.accountValid = true;
        $scope.errorMessage = "";
        $scope.secondPassphrase = userService.secondPassphrase;
        $scope.publicKey = userService.publicKey;
        $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;
        $scope.checkSecondPass = false;
        $scope.focus = 'contact';
        $scope.presendError = false;

        $scope.passcheck = function (fromSecondPass) {
            if (fromSecondPass) {
                $scope.checkSecondPass = false;
                $scope.passmode = $scope.rememberedPassword ? false : true;
                if ($scope.passmode) {
                    $scope.focus = 'secretPhrase';
                }
                else {
                    $scope.focus = 'contact';
                }
                $scope.secondPhrase = '';
                $scope.pass = '';
                return;
            }
            if ($scope.rememberedPassword) {
                var isAddress = /^[0-9]+[C|c]$/g;
                var allowSymbols = /^[a-z0-9!@$&_.]+$/g;
                if ($scope.contact.trim() == '') {
                    $scope.errorMessage = 'Empty contact'
                    $scope.presendError = true;
                } else {
                    if (isAddress.test($scope.contact) || allowSymbols.test($scope.contact.toLowerCase())) {
                        $scope.presendError = false;
                        $scope.errorMessage = ''
                        $scope.addFolower($scope.rememberedPassword);
                    }
                    else {
                        $scope.errorMessage = 'Incorrect contact name or address'
                        $scope.presendError = true;
                    }
                }

            }
            else {
                var isAddress = /^[0-9]+[C|c]$/g;
                var allowSymbols = /^[a-z0-9!@$&_.]+$/g;
                if ($scope.contact.trim() == '') {
                    $scope.errorMessage = 'Empty contact'
                    $scope.presendError = true;
                } else {
                    if (isAddress.test($scope.contact) || allowSymbols.test($scope.contact.toLowerCase())) {
                        $scope.presendError = false;
                        $scope.errorMessage = ''
                        $scope.passmode = !$scope.passmode;
                        $scope.focus = 'secretPhrase';
                        $scope.pass = '';
                    }
                    else {
                        $scope.errorMessage = 'Incorrect contact name or address'
                        $scope.presendError = true;
                    }
                }
            }
        }

        $scope.close = function () {
            if ($scope.destroy) {
                $scope.destroy();
            }

            addContactModal.deactivate();
        }

        $scope.addFolower = function (pass, withSecond) {
            if ($scope.secondPassphrase && !withSecond) {
                $scope.checkSecondPass = true;
                $scope.focus = 'secondPhrase';
                return;
            }
            var queryParams = {
                secret: pass,
                following: '+' + $scope.contact,
                publicKey: userService.publicKey
            }
            if ($scope.secondPassphrase) {
                queryParams.secondSecret = $scope.secondPhrase;
                if ($scope.rememberedPassword) {
                    queryParams.secret = $scope.rememberedPassword;
                }
            }
            $scope.view.inLoading = true;
            contactsService.addContact(queryParams, function (response) {
                $scope.view.inLoading = false;
                if (response.data.success) {
                    $timeout(function () {
                        $scope.$broadcast('updateControllerData', ['main.contacts']);
                    });
                    $scope.close();
                }
                else {
                    $scope.errorMessage = response.data.error;
                }
            });
        }
    }]);