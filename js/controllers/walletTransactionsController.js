require('angular');

angular.module('webApp').controller('walletTransactionsController',
    ['$scope', '$rootScope', '$http', "userService", "$interval", "sendCryptiModal", "secondPassphraseModal", "delegateService", 'viewFactory', 'transactionsService', 'ngTableParams', 'transactionInfo', '$timeout', 'userInfo', '$filter', 'multiMembersModal', '$stateParams', 'multiService',
        function ($rootScope, $scope, $http, userService, $interval, sendCryptiModal, secondPassphraseModal, delegateService, viewFactory, transactionsService, ngTableParams, transactionInfo, $timeout, userInfo, $filter, multiMembersModal, $stateParams, multiService) {
            $scope.view = viewFactory;
            $scope.view.page = {title: 'Transactions for 17649443584386761059C', previos: 'main.multi'};
            $scope.view.bar = {};
            $scope.showAllColumns = true;
            $scope.showFullTime = false;
            $scope.transactionsView = transactionsService;
            $scope.searchTransactions = transactionsService;
            $scope.countForgingBlocks = 0;
            $scope.walletAddress = $stateParams.walletId;

            $scope.userInfo = function (userId) {
                $scope.modal = userInfo.activate({userId: userId});
            }

            $scope.transactionInfo = function (block, signList) {
                $scope.modal = transactionInfo.activate({block: block, signList: signList});
            }


            $scope.getParams = function () {

                $http.get("/api/accounts?address=" + $scope.walletAddress)
                    .then(function (response) {

                        if (response.data.success) {
                            $scope.requestParams = {
                                ownerPublicKey: response.data.account.publicKey,
                                ownerAddress: response.data.account.address,
                                recipientId: response.data.account.address,
                                senderId: response.data.account.address
                            };
                            $scope.updateTransactions();
                        }
                        else {
                            console.log('Cant get account ' + $scope.walletAddress);
                        }
                    });


            }();

            //Transactions
            $scope.tableWalletTransactions = new ngTableParams({
                page: 1,
                count: 25,
                sorting: {
                    t_timestamp: 'desc'
                }
            }, {
                total: 0,
                counts: [],
                getData: function ($defer, params) {
                    if ($scope.requestParams) {
                        transactionsService.getMultiTransactions($defer, params, $scope.filter,
                            $scope.requestParams, function (error) {
                                $timeout(function () {
                                    $scope.$apply();
                                }, 1);
                            });
                    }


                }
            });

            $scope.tableWalletTransactions.settings().$scope = $scope;

            $scope.$watch("filter.$", function () {
                $scope.tableWalletTransactions.reload();
            });
            //end Transactions


            $scope.updateTransactions = function () {
                $scope.tableWalletTransactions.reload();
            }

            $scope.$on('$destroy', function () {

            });


            $scope.showMembers = function (confirmed) {
                $scope.multiMembersModal = multiMembersModal.activate({
                    confirmed: confirmed,
                    destroy: function () {
                    }
                });
            }
        }]);