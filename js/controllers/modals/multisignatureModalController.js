require('angular');

angular.module('webApp').controller('multisignatureModalController',
    ["$scope", "$http", "multisignatureModal", "viewFactory", "userService",
        function ($scope, $http, multisignatureModal, viewFactory, userService) {
            $scope.view = viewFactory;
            $scope.view.loadingText = "Set members of account";
            $scope.secondPassphrase = userService.secondPassphrase;
            $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;
            $scope.authData = {
                password: $scope.rememberedPassword || '',
                secondPassword: ''
            }
            $scope.addingError = '';
            $scope.currentAddress = userService.address;
            $scope.close = function () {
                if ($scope.destroy) {
                    $scope.destroy(false);
                }
                multisignatureModal.deactivate();
            }

            $scope.step = 1;

            $scope.totalCount = 0;
            $scope.sign = 2;

            $scope.goToStep3 = function () {
                $scope.addingError = '';
                if ($scope.totalCount) {
                    $scope.step = 3;
                }
                else {
                    $scope.addingError = 'Please add at least one additional member to create a multi signature account';
                }
            }

            $scope.members = {};

            $scope.deleteMember = function (publicKey) {
                delete $scope.members[publicKey];
                $scope.totalCount = $scope.totalCount - 1;
            }

            $scope.addMember = function (contact) {
                $scope.addingError = '';
                var isAddress = /^[0-9]+[C|c]$/g;
                var allowSymbols = /^[a-z0-9!@$&_.]+$/g;
                var correctAddress = isAddress.test(contact);
                var correctName = allowSymbols.test(contact.toLowerCase());
                if ($scope.contact.trim() == '') {
                    $scope.addingError = 'Empty contact';
                    console.log($scope.addingError);
                }
                else {
                    var Buffer = require('buffer/').Buffer;
                    var buffer =  []
                    try {
                        buffer = Buffer(contact, "hex")}
                    catch(err){

                    }
                    if (buffer.length == 32) {
                        var crypti = require('crypti-js');
                        var address = crypti.crypto.getAddress($scope.contact);
                        if ($scope.members[$scope.contact] || address == userService.address){
                            return;
                        }
                        $scope.members[$scope.contact] = {address: address, publicKey: $scope.contact};
                        $scope.totalCount = $scope.totalCount + 1;
                        $scope.contact = '';
                    }
                    else {
                        if (correctAddress || correctName) {
                            if (correctAddress) {
                                $http.get("/api/accounts?address=" + contact).then(function (response) {
                                    if (response.data.success) {
                                        $scope.presendError = false;
                                        $scope.addingError = '';
                                        if ($scope.members[response.data.account.publicKey] || contact == userService.address) {
                                            return;
                                        }
                                        $scope.members[response.data.account.publicKey] = response.data.account;
                                        $scope.totalCount = $scope.totalCount + 1;
                                        $scope.contact = '';
                                    }
                                    else {
                                        $scope.addingError = response.data.error;
                                        console.log($scope.addingError);
                                    }
                                });

                            }
                            else {
                                $http.get("/api/accounts/username/get?username=" + encodeURIComponent(contact)).then(function (response) {
                                    if (response.data.success) {
                                        $scope.presendError = false;
                                        $scope.addingError = ''
                                        if ($scope.members[response.data.account.publicKey] || response.data.account.address == userService.address) {
                                            return;
                                        }
                                        $scope.members[response.data.account.publicKey] = response.data.account;
                                        $scope.totalCount = $scope.totalCount + 1;
                                        $scope.contact = '';
                                    }
                                    else {
                                        $scope.addingError = response.data.error;
                                    }
                                });
                            }

                        }
                        else {

                            $scope.addingError = 'Incorrect contact name or address';
                            console.log($scope.addingError);
                        }
                    }

                }
            }

            $scope.putMembers = function (fromPass) {
                $scope.errorMessage = '';
                if (fromPass) {
                    if ($scope.authData.password.trim() == '' || ($scope.authData.secondPassword.trim() == '' && $scope.secondPassphrase)) {
                        $scope.errorMessage = "Missing Password or Second Password";
                        return;
                    }
                }
                else {
                    if ($scope.secondPassphrase || !$scope.rememberedPassword) {
                        $scope.step = 4;
                        return;
                    }
                }

                var data = {
                    secret: $scope.authData.password,
                    publicKey: userService.publicKey,
                    min: $scope.sign,
                    lifetime: 24,
                    keysgroup: Object.keys($scope.members).map(function (element) {
                        return '+' + element;
                    })
                };
                if ($scope.secondPassphrase) {
                    data.secondSecret = $scope.authData.secondPassword;
                }
                $scope.view.inLoading = true;
                $http.put('/api/multisignatures', data).then(function (response) {
                    $scope.view.inLoading = false;
                    if (response.data.error) {
                        $scope.errorMessage = response.data.error;
                    }
                    else {
                        if ($scope.destroy) {
                            $scope.destroy(true);
                        }
                        multisignatureModal.deactivate();
                    }

                });
            }

        }]);